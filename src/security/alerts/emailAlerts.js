import * as emailService from '../../services/emailService.js';

export const triggerEmailAlert = async (targetEmail, alertTitle, detailsObj) => {
  const alertBody = `
    [SECURITY ALERT NOTIFICATION]
    
    Event: ${alertTitle}
    Timestamp: ${new Date().toISOString()}
    Context details: ${JSON.stringify(detailsObj, null, 2)}
    
    If you did not authorize this action, please rotate your access credentials immediately.
  `;
  
  await emailService.sendTransactionalEmail(
    targetEmail,
    `⚠️ Critical System Notification: ${alertTitle}`,
    alertBody,
    'Security_Urgent_Escalations'
  );
};