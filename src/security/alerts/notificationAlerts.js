import * as notificationService from '../../services/notificationService.js';

export const dispatchInAppAlert = async (userId, alertTitle, cleanMessage) => {
  if (!userId) return;
  await notificationService.createSystemNotification(
    userId,
    alertTitle,
    cleanMessage,
    'security'
  );
};