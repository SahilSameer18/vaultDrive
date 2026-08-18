import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";
import { verifyGoogleIdToken } from "../utils/googleAuth.js";


// Standard security cookie configurations (lax in dev, none in production for cross-site deployment)
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
});

// Generate JWT tokens and save hashed refresh token in database
const generateAndStoreTokens = async (userId) => {
  // Prune any stale/expired tokens belonging to this user
  await prisma.refreshToken.deleteMany({
    where: {
      userId,
      expiresAt: { lt: new Date() },
    },
  });

  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  const tokenHash = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.refreshToken.create({
    data: {
      tokenHash,
      userId,
      expiresAt,
    },
  });

  return { accessToken, refreshToken };
};

// Register a new user account with hashed password and initial token session
export const register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new ApiError(409, "User with this email already exists");
      }
      if (existingUser.username === username) {
        throw new ApiError(409, "Username is already taken");
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    const { accessToken, refreshToken } = await generateAndStoreTokens(user.id);

    const cookieOptions = getCookieOptions();
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 mins
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res
      .status(201)
      .json(
        new ApiResponse(
          201,
          { user },
          "User registered successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Authenticate user credentials and create a new session
export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    if (!user.passwordHash) {
      throw new ApiError(
        400,
        "This account was created with Google OAuth. Please sign in using Google."
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid credentials");
    }

    const { accessToken, refreshToken } = await generateAndStoreTokens(user.id);

    const cookieOptions = getCookieOptions();
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userWithoutPassword },
          "Login successful"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Rotate refresh token (invalidate old token hash, issue new token pair)
export const refresh = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      throw new ApiError(401, "Refresh token not provided");
    }

    let decoded;
    try {
      decoded = verifyRefreshToken(incomingRefreshToken);
    } catch (err) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const userTokens = await prisma.refreshToken.findMany({
      where: { userId: decoded.id },
    });

    let matchedToken = null;
    for (const tokenRecord of userTokens) {
      const isMatch = await bcrypt.compare(
        incomingRefreshToken,
        tokenRecord.tokenHash
      );
      if (isMatch) {
        matchedToken = tokenRecord;
        break;
      }
    }

    if (!matchedToken || matchedToken.expiresAt < new Date()) {
      if (matchedToken) {
        await prisma.refreshToken.delete({ where: { id: matchedToken.id } });
      }
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    // Invalidate consumed refresh token before issuing a new one
    await prisma.refreshToken.delete({ where: { id: matchedToken.id } });

    // Issue new token pair
    const { accessToken, refreshToken: newRefreshToken } =
      await generateAndStoreTokens(decoded.id);

    const cookieOptions = getCookieOptions();
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    next(error);
  }
};

// Invalidate current refresh token in database and clear client cookies
export const logout = async (req, res, next) => {
  try {
    const incomingRefreshToken =
      req.cookies?.refreshToken || req.body?.refreshToken;

    if (incomingRefreshToken) {
      try {
        const decoded = verifyRefreshToken(incomingRefreshToken);
        const userTokens = await prisma.refreshToken.findMany({
          where: { userId: decoded.id },
        });

        for (const tokenRecord of userTokens) {
          const isMatch = await bcrypt.compare(
            incomingRefreshToken,
            tokenRecord.tokenHash
          );
          if (isMatch) {
            await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
            break;
          }
        }
      } catch (err) {
        // Token invalid/expired; clear cookies regardless
      }
    }

    const cookieOptions = getCookieOptions();
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Logged out successfully"));
  } catch (error) {
    next(error);
  }
};

// Get current authenticated user profile
export const getMe = async (req, res, next) => {
  try {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { user: req.user }, "Current user fetched successfully")
      );
  } catch (error) {
    next(error);
  }
};

// Authenticate Google OAuth ID token, provision or link user, and return JWT cookies
export const googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;
    const { googleId, email, emailVerified, picture } =
      await verifyGoogleIdToken(idToken);

    if (!emailVerified) {
      throw new ApiError(400, "Google account email is not verified");
    }

    // 1. Check if OAuth account already exists
    let oauthAccount = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerUserId: {
          provider: "google",
          providerUserId: googleId,
        },
      },
      include: { user: true },
    });

    let user;

    if (oauthAccount) {
      user = oauthAccount.user;
      if (!user.avatarUrl && picture) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { avatarUrl: picture },
        });
      }
    } else {
      // 2. Check if a user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        user = existingUser;
        await prisma.oAuthAccount.create({
          data: {
            provider: "google",
            providerUserId: googleId,
            userId: user.id,
          },
        });

        if (!user.avatarUrl && picture) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { avatarUrl: picture },
          });
        }
      } else {
        // 3. Create new user and OAuth account in a Prisma transaction
        const baseUsername = email
          .split("@")[0]
          .replace(/[^a-zA-Z0-9_]/g, "");
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        let username = `${baseUsername}_${randomSuffix}`;

        const usernameCheck = await prisma.user.findUnique({
          where: { username },
        });
        if (usernameCheck) {
          username = `${baseUsername}_${Date.now().toString().slice(-6)}`;
        }

        user = await prisma.user.create({
          data: {
            email,
            username,
            avatarUrl: picture || null,
            passwordHash: null,
            oauthAccounts: {
              create: {
                provider: "google",
                providerUserId: googleId,
              },
            },
          },
        });
      }
    }

    const { accessToken, refreshToken } = await generateAndStoreTokens(user.id);

    const cookieOptions = getCookieOptions();
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const userWithoutPassword = {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { user: userWithoutPassword },
          "Google login successful"
        )
      );
  } catch (error) {
    next(error);
  }
};

// ─── Update Profile (username) ────────────────────────────────────────────────
export const updateProfile = async (req, res, next) => {
  try {
    const { username } = req.body;
    const userId = req.user.id;

    // Ensure username is not already taken by another user
    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== userId) {
      throw new ApiError(409, "Username is already taken");
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { username },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
        passwordHash: true,
      },
    });

    const { passwordHash, ...user } = updated;

    return res.status(200).json(
      new ApiResponse(200, { user: { ...user, hasPassword: !!passwordHash } }, "Profile updated successfully")
    );
  } catch (error) {
    next(error);
  }
};

// ─── Set / Change Password ────────────────────────────────────────────────────
// SET mode  (OAuth user — no passwordHash): only newPassword + confirmPassword required
// CHANGE mode (password account)          : currentPassword must be verified first
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, passwordHash: true },
    });

    if (!user) throw new ApiError(404, "User not found");

    if (user.passwordHash) {
      // CHANGE mode — current password is required and must be correct
      if (!currentPassword) {
        throw new ApiError(400, "Current password is required to change your password");
      }
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        throw new ApiError(401, "Current password is incorrect");
      }
    }

    // Hash new password and save
    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    // Invalidate all existing refresh tokens (forces re-login on all other devices)
    await prisma.refreshToken.deleteMany({ where: { userId } });

    const message = user.passwordHash
      ? "Password changed successfully. Other sessions have been signed out."
      : "Password set successfully. You can now sign in with your email and password.";

    return res.status(200).json(new ApiResponse(200, null, message));
  } catch (error) {
    next(error);
  }
};

