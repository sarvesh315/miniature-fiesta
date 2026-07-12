import { describe, test, expect } from 'vitest';
import crypto from 'crypto';

function decryptWithFallback(cipherText, currentSecret, legacySecretsArray = []) {
  const keysToTry = [currentSecret, ...legacySecretsArray];
  
  for (const key of keysToTry) {
    try {
      const decipher = crypto.createDecipheriv('aes-256-ecb', Buffer.alloc(32, key), null);
      let decrypted = decipher.update(cipherText, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
    } catch {
      continue; // Try next fallback key down the stack array
    }
  }
  throw new Error('Decryption completely failed across all legacy keys');
}

describe('🔄 Security: Cryptographic Key Migration Verification', () => {
  const oldSecret = 'legacy_secret_key_0000000000000';
  const newSecret = 'modern_secret_key_1111111111111';
  const secretPayload = 'ProtectedPIIStringData';

  test('✅ Should read old records cleanly using the fallback keys array', () => {
    // Encrypt raw text using old production credentials
    const cipher = crypto.createCipheriv('aes-256-ecb', Buffer.alloc(32, oldSecret), null);
    let historicalBlob = cipher.update(secretPayload, 'utf8', 'hex');
    historicalBlob += cipher.final('hex');

    // Attempt to decrypt under modern secrets system with legacy array fallback tracking configured
    const result = decryptWithFallback(historicalBlob, newSecret, [oldSecret, 'extra_backup_key']);
    expect(result).toBe(secretPayload);
  });
});