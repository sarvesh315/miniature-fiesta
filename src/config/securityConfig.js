import dotenv from 'dotenv';
dotenv.config();

export const securityConfig = {
  // JWT Configuration
  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'super_secret_access_key',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_key',
    accessExpiration: '15m',
    refreshExpiration: '7d',
  },

  // Brute Force & Rate Limiting Thresholds
  rateLimits: {
    globalWindow: 15 * 60 * 1000, // 15 minutes
    globalMax: 100,               // Max requests per window
    authWindow: 60 * 60 * 1000,   // 1 hour
    authMax: 5,                   // Max login/OTP attempts per hour before lockout
  },

  // Password Policy
  passwordPolicy: {
    minLength: 12,
    requireUppercase: true,
    requireNumbers: true,
    requireSpecialChar: true,
    maxAgeDays: 90, // Force password rotation
  },

  // Multi-Factor Authentication
  otp: {
    expiryMinutes: 5,
    length: 6,
  }
};