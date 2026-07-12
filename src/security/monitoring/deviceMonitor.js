import Device from '../../models/Device.js';
import crypto from 'crypto';

export const generateDeviceFingerprint = (req) => {
  const ua = req.headers['user-agent'] || 'unknown';
  const acceptLang = req.headers['accept-language'] || 'unknown';
  // Standard simple composite hardware signature derivation
  return crypto.createHash('sha256').update(`${ua}-${acceptLang}`).digest('hex');
};

export const verifyRequestDevice = async (userId, req) => {
  const fingerprint = generateDeviceFingerprint(req);
  const existingDevice = await Device.findOne({ user: userId, deviceFingerprint: fingerprint });
  
  if (!existingDevice) {
    return { status: 'UNKNOWN_DEVICE', fingerprint };
  }
  return { status: existingDevice.isTrusted ? 'TRUSTED' : 'UNTRUSTED', fingerprint };
};