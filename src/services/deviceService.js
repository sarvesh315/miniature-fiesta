import Device from '../models/Device.js';

export const registerHardwareFingerprint = async (userId, fingerprint, name) => {
  return await Device.findOneAndUpdate(
    { user: userId, deviceFingerprint: fingerprint },
    { deviceName: name, lastUsedAt: Date.now() },
    { upsert: true, new: true }
  );
};