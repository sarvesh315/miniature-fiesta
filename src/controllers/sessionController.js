export const getActiveSessions = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, userId: req.user.id, sessions: [] });
  } catch (error) {
    next(error);
  }
};

export const revokeSession = async (req, res, next) => {
  try {
    const { id } = req.params;
    res.status(200).json({ success: true, message: `Session ${id} terminated.` });
  } catch (error) {
    next(error);
  }
};

export const revokeAllSessions = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, message: 'All alternate concurrent devices logged out.' });
  } catch (error) {
    next(error);
  }
};