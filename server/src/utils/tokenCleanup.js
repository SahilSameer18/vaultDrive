import prisma from "../lib/prisma.js";

/**
 * Sweeps the database and purges all expired refresh tokens across all users.
 * Safe to run frequently — lightweight indexed range deletion.
 * @returns {Promise<number>} count of deleted tokens
 */
export const cleanupExpiredTokens = async () => {
  try {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    if (result.count > 0) {
      console.log(`[AUTH CLEANUP] Purged ${result.count} expired refresh token(s).`);
    }

    return result.count;
  } catch (error) {
    console.error("[AUTH CLEANUP ERROR] Failed to delete expired tokens:", error.message || error);
    return 0;
  }
};
