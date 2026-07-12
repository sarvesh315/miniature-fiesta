import jwt from 'jsonwebtoken';
import Session from '../models/Session.js';
import { securityConfig } from '../config/securityConfig.js';

export const generateSessionTokens = async (userId, deviceInfo) => {
  const accessToken = jwt.sign({ id: userId }, securityConfig.jwt.accessTokenSecret, { expiresIn: securityConfig.jwt.accessExpiration });
  const refreshToken = jwt.sign({ id: userId }, securityConfig.jwt.refreshTokenSecret, { expiresIn: securityConfig.jwt.refreshExpiration });

  const durationStr = securityConfig.jwt.refreshExpiration;
  const days = parseInt(durationStr, 10) || 7;
  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  await Session.create({
    user: userId,
    refreshToken,
    ip: deviceInfo.ip || '0.0.0.0',
    userAgent: deviceInfo.userAgent || 'unknown',
    expiresAt
  });

  return { accessToken, refreshToken };
};

export const renewAccessTokens = async (providedRefreshToken) => {
  const activeSession = await Session.findOne({ refreshToken: providedRefreshToken, isValid: true });
  if (!activeSession) throw new Error('Session tracking invalid or revoked');

  try {
    const decoded = jwt.verify(providedRefreshToken, securityConfig.jwt.refreshTokenSecret);
    const accessToken = jwt.sign({ id: decoded.id }, securityConfig.jwt.accessTokenSecret, { expiresIn: securityConfig.jwt.accessExpiration });
    return { accessToken };
 } catch {
  throw new Error('Refresh token confirmation has expired');
}
};