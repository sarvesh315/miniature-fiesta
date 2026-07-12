import Notification from '../models/Notification.js';

export const createSystemNotification = async (recipientId, title, message, type = 'system') => {
  return await Notification.create({ recipient: recipientId, title, message, type });
};