import { triggerEmailAlert } from './emailAlerts.js';
import { dispatchInAppAlert } from './notificationAlerts.js';

export const escalateSecurityIncident = async (userId, title, payload, severity = 'high') => {
  console.warn(`🚨 [INCIDENT ESCALATION - ${severity.toUpperCase()}]: ${title}`);
  
  // Always trigger in-app system notifications
  await dispatchInAppAlert(userId, title, payload.message || 'Anomaly identified');

  // Escalate directly to verified email streams if threat footprints are high
  if (severity === 'high' || severity === 'critical') {
    await triggerEmailAlert(payload.email || 'security-audit@yourdomain.com', title, payload);
  }
};