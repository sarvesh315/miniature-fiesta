import mongoose from 'mongoose';
import dotenv from 'dotenv';

// 1. Force state constraints into a sandbox environment execution line
dotenv.config({ path: '.env.test' });

process.env.NODE_ENV = 'test';
process.env.PORT = process.env.PORT || '5001';

// Provide absolute fallback configurations if .env.test parameters are missing
process.env.JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'sandbox_access_token_secret_phrase_64_characters_minimum_string';
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'sandbox_refresh_token_secret_phrase_64_characters_minimum_string';
process.env.ENCRYPTION_SECRET = process.env.ENCRYPTION_SECRET || 'abcd1234efgh5678ijkl9012mnop3456'; // Exactly 32 bytes for AES-256
process.env.HASH_SALT = process.env.HASH_SALT || 'sandbox_cryptographic_system_salt_signature';

// 2. Global Setup: Spin up the stateful database sandbox connection
beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    const sandboxUri = process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/secure_backend_sandbox';
    
    await mongoose.connect(sandboxUri)
      .catch((err) => {
        console.error(`💥 Failed to establish sandboxed database connection pool: ${err.message}`);
        process.exit(1);
      });
  }
  await wipeSandboxDataCollections();
});

// 3. Post-Test Cleanup Matrix: Keep document layers pristine between separate suite threads
afterEach(async () => {
  await wipeSandboxDataCollections();
});

// 4. Teardown Hook: Sever open network ports cleanly on exit
afterAll(async () => {
  await wipeSandboxDataCollections();
  await mongoose.connection.close();
});

/**
 * Iterates across active Mongoose collections to drop documents cleanly.
 * This prevents data leaking across cross-functional test vectors.
 */
async function wipeSandboxDataCollections() {
  const activeCollections = mongoose.connection.collections;
  const purgeOperations = [];

  for (const collectionName in activeCollections) {
    if (Object.prototype.hasOwnProperty.call(activeCollections, collectionName)) {
      purgeOperations.push(activeCollections[collectionName].deleteMany({}));
    }
  }

  await Promise.all(purgeOperations);
}

// ==========================================
// 5. GLOBAL INFRASTRUCTURE MOCKS
// ==========================================
// Mock out-of-band delivery channels to prevent unit tests from triggering live mail APIs
jest.mock('../services/emailService.js', () => ({
  sendSecurityAlertEmail: jest.fn().mockResolvedValue({ success: true }),
  sendMfaOtpEmail: jest.fn().mockResolvedValue({ success: true })
}));

jest.mock('../services/smsService.js', () => ({
  sendEmergencySmsAlert: jest.fn().mockResolvedValue({ success: true })
}));