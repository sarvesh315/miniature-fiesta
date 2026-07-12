import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
// Ensure your ENCRYPTION_SECRET key is exactly 32 bytes in length
const SECRET_KEY = process.env.ENCRYPTION_SECRET || 'your-fallback-32-byte-secret-key-here!';

export const encryptField = (plainText) => {
  if (!plainText) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(SECRET_KEY), iv);
  
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag().toString('hex');
  return `${iv.toString('hex')}:${authTag}:${encrypted}`;
};

export const decryptField = (cipherText) => {
  if (!cipherText) return null;
  const [ivHex, authTagHex, encryptedHex] = cipherText.split(':');
  
  const decipher = crypto.createDecipheriv(
    ALGORITHM, 
    Buffer.from(SECRET_KEY), 
    Buffer.from(ivHex, 'hex')
  );
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  
  let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};