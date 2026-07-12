import Session from '../../models/Session.js';
import { verifyRefreshTokenSignature, issueAccessToken } from './jwtManager.js';

export const executeTokenRotation = async (oldRefreshToken) => {
  // Confirm the current refresh token exists and hasn't been blacklisted
  const trackedSession = await Session.findOne({ refreshToken: oldRefreshToken, isValid: true });
  if (!trackedSession) {
    throw new Error('Provided credentials revoked or untrusted');
  }

  try {
    const payload = verifyRefreshTokenSignature(oldRefreshToken);
    
    // Issue a fresh short-lived access token
    const newAccessToken = issueAccessToken(payload.id);
    
    return {
      accessToken: newAccessToken
    };
} catch (err) {
  console.error('Refresh token verification failed:', err);

  trackedSession.isValid = false;
  await trackedSession.save();

  throw new Error('Expired signature sequence identified');
}
};