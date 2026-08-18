import { verifyAccessToken } from "../utils/jwt.js";
import ApiError from "../utils/ApiError.js";
import prisma from "../lib/prisma.js";

export const authenticate = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized access: Token not provided");
    }

    const decoded = verifyAccessToken(token);

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        username: true,
        avatarUrl: true,
        createdAt: true,
        passwordHash: true,
      },
    });

    if (!dbUser) {
      throw new ApiError(401, "Unauthorized: User no longer exists");
    }

    // Expose hasPassword flag without leaking the actual hash
    const { passwordHash, ...userFields } = dbUser;
    req.user = { ...userFields, hasPassword: !!passwordHash };
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      return next(new ApiError(401, "Unauthorized: Token invalid or expired"));
    }
    next(error);
  }
};
