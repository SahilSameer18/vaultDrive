import { OAuth2Client } from "google-auth-library";
import ApiError from "./ApiError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Cryptographically verify Google ID token received from client
 * @param {string} idToken 
 * @returns {Promise<{ googleId: string, email: string, emailVerified: boolean, name: string, picture: string }>}
 */
export const verifyGoogleIdToken = async (idToken) => {
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new ApiError(401, "Invalid Google token payload");
    }

    return {
      googleId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      name: payload.name,
      picture: payload.picture,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(401, `Google authentication failed: ${error.message}`);
  }
};

