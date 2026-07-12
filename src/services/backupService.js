import crypto from 'crypto';
import zlib from 'zlib';
import User from '../models/User.js';

const ALGORITHM = 'aes-256-cbc';

export const generateSecureDatabaseBackup = async () => {
  const backupKey = process.env.BACKUP_PASSPHRASE;
  if (!backupKey) throw new Error('Backup abort: Cryptographic passphrase key is unconfigured.');

  try {
    // 1. Extract raw critical collection snapshots
    const usersData = await User.find({}).select('-password');
    const payloadString = JSON.stringify({ users: usersData, exportedAt: new Date() });

    // 2. Compress the data payload to mitigate size overhead
    const compressedPayload = zlib.gzipSync(Buffer.from(payloadString, 'utf8'));

    // 3. Encrypt the binary blob using AES-256-CBC
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(backupKey, 'salt', 32);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encryptedBackup = cipher.update(compressedPayload);
    encryptedBackup = Buffer.concat([encryptedBackup, cipher.final()]);

    // 4. Output format includes the initialization vector prepended to the ciphertext
    const finalArchivedBuffer = Buffer.concat([iv, encryptedBackup]);

    console.log(`💾 Encrypted database snapshot compiled successfully (${finalArchivedBuffer.length} bytes).`);
    // This buffer can now be safely uploaded to your free cloud storage without exposure risks
    return finalArchivedBuffer;
  } catch (error) {
    console.error(`❌ Backup encryption framework failed: ${error.message}`);
    throw error;
  }
};