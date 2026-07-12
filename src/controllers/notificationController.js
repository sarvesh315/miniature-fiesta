

export const getNotifications = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, alerts: [] });
  } catch (error) {
    next(error);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Notification marked read.' });
  } catch (error) {
    next(error);
  }
};

export const markAllAsRead = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Inbox cleared.' });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'Alert permanently hidden.' });
  } catch (error) {
    next(error);
  }
};