import crypto from 'crypto';

/**
 * Generates a high-entropy random hex token string (useful for quick passcodes/links)
 */
export const generateRandomToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Computes a standard, fast SHA-256 hash string for quick matching
 */
export const createBasicHash = (stringData) => {
  return crypto.createHash('sha256').update(stringData).digest('hex');
};

/**
 * Prevents timing attacks when comparing sensitive hash signatures or tokens
 */
export const secureCompare = (stringA, stringB) => {
  if (typeof stringA !== 'string' || typeof stringB !== 'string') return false;
  
  const bufA = Buffer.from(stringA);
  const bufB = Buffer.from(stringB);
  
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
};