import User from '../../models/User.js';
import Session from '../../models/Session.js';
import { triggerEmailAlert } from './emailAlerts.js';

export const escalateSecurityIncident = async (userId, title, payload, severity = 'high') => {
  console.warn(`🚨 [INCIDENT SYSTEM TRIGGERED - ${severity.toUpperCase()}]: ${title}`);

  // Auto-Isolation Protection Matrix
  if (severity === 'critical' && userId) {
    try {
      // 1. Instantly lock down the account profile
      await User.findByIdAndUpdate(userId, {
        isAccountLocked: true,
        lockReason: `Automated System Lockdown: Triggered by [${title}]`
      });

      // 2. Kill all active refresh token rows across all platforms
      await Session.deleteMany({ user: userId });
      
      console.log(`🔒 Account isolation successfully completed for User ID: ${userId}`);
    } catch (lockError) {
      console.error(`💥 Critical Failure: Isolation engine was obstructed: ${lockError.message}`);
    }
  }

  // 3. Dispatch out-of-band email notifications directly to your Security Operations alias
  await triggerEmailAlert(
    process.env.SECURITY_OPS_EMAIL || 'sec-ops@yourdomain.com', 
    `[CRITICAL ESCALATION] - ${title}`, 
    { userId, ...payload }
  );
};