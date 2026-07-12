import LoginHistory from '../../models/LoginHistory.js';

export const recordLoginAttempt = async (userId, ip, userAgent, status, failureReason = null) => {
  try {
    await LoginHistory.create({
      user: userId,
      ip,
      userAgent,
      status,
      failureReason
    });
  } catch (error) {
    console.error(`🚨 Login monitor recording failed: ${error.message}`);
  }
};