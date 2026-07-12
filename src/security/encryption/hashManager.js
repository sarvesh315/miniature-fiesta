import crypto from 'crypto';

export const generateSecureHash = (inputData, salt = '') => {
  return crypto
    .createHmac('sha256', process.env.HASH_SALT || 'default-system-salt')
    .update(`${inputData}${salt}`)
    .digest('hex');
};