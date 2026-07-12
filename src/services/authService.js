import User from '../models/User.js';
import Session from '../models/Session.js';
import TokenBlacklist from '../models/TokenBlacklist.js';
import jwt from 'jsonwebtoken';
import { securityConfig } from '../config/securityConfig.js';

// ... other services ...

export const invalidateSession = async (
  userId,
  refreshToken,
  accessToken = null
) => {
  // Remove the refresh token session
  await Session.deleteOne({ refreshToken });

  // Record logout time for the user
  await User.findByIdAndUpdate(userId, {
    lastLogoutAt: new Date(),
  });

  // Blacklist the current access token
  if (accessToken) {
    try {
      const decoded = jwt.verify(
        accessToken,
        securityConfig.jwt.accessTokenSecret,
        { ignoreExpiration: true }
      );

      if (decoded.jti) {
        const expiresAt = new Date(decoded.exp * 1000);

        if (expiresAt > new Date()) {
          await TokenBlacklist.create({
            jti: decoded.jti,
            expiresAt,
          });
        }
      }
    } catch {
      // Fail silently if token decoding completely breaks
    }
  }
};