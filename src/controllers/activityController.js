export const getActivityLogs = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, user: req.user.id, activities: [] });
  } catch (error) {
    next(error);
  }
};