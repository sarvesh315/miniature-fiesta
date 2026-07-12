import OTP from '../models/OTP.js';
import * as emailService from './emailService.js';

export const generateAndSendOTP = async (email, purpose) => {
  // Generate a random 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  await OTP.create({ email, code, purpose });

  // Dispatches directly via Campaign Monitor
  await emailService.sendTransactionalEmail(
    email,
    'Your App Security Verification Code',
    `Your validation safety token is: ${code}. It expires inside 5 minutes.`,
    'Security_MFA_Tokens'
  );
};

export const verifyOTPCode = async (email, code, purpose) => {
  const entry = await OTP.findOne({ email, code, purpose, isVerified: false });
  if (!entry) return false;

  entry.isVerified = true;
  await entry.save();
  return true;
};