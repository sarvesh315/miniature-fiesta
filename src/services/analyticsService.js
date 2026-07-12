import User from '../models/User.js';
import SecurityEvent from '../models/SecurityEvent.js';

export const getPlatformMetrics = async () => {
  const registrationCount = await User.countDocuments();
  const criticalThreats = await SecurityEvent.countDocuments({ severity: 'critical' });
  
  return {
    totalAccounts: registrationCount,
    interceptedCriticalThreats: criticalThreats
  };
};