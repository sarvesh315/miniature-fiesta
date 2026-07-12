import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { securityConfig } from '../../config/securityConfig.js';


export const issueAccessToken = (userId) => {
  const jti = crypto.randomUUID(); // Unique identifier for this specific token instance

  const token = jwt.sign(
    { id: userId, jti },
    securityConfig.jwt.accessTokenSecret,
    {
      expiresIn: securityConfig.jwt.accessExpiration,
    }
  );

  return token;
};

export const issueRefreshToken = (userId) => {
  const jti = crypto.randomUUID();

  return jwt.sign(
    {
      id: userId,
      jti,
    },
    securityConfig.jwt.refreshTokenSecret,
    {
      expiresIn: securityConfig.jwt.refreshExpiration,
    }
  );
};

export const verifyAccessTokenSignature = (token) => {
  try {
    return jwt.verify(token, securityConfig.jwt.accessTokenSecret);
  } catch {
    throw new Error('Access signature parsing verification failed');
  }
};

export const verifyRefreshTokenSignature = (token) => {
  try {
    return jwt.verify(token, securityConfig.jwt.refreshTokenSecret);
  } catch {
    throw new Error('Refresh token evaluation failed');
  }
};