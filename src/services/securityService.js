import User from '../models/User.js';
import SecurityEvent from '../models/SecurityEvent.js';

export const toggleMFAState = async (userId, enableState) => {
  await User.findByIdAndUpdate(userId, { isTwoFactorEnabled: enableState });
};

export const flagSecurityAnomaly = async (eventType, severity, ip, userAgent, userId, metadata) => {
  await SecurityEvent.create({
    eventType,
    severity,
    ip,
    userAgent,
    userId,
    details: metadata
  });
};