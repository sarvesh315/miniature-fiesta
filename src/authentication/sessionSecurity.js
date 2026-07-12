import Session from '../../models/Session.js';

export const auditUserSessionFootprint = async (userId, currentSessionId) => {
  // Query alternate locations or active browser sessions
  const activeDeviceConnections = await Session.find({
    user: userId,
    _id: { $ne: currentSessionId },
    isValid: true
  });

  return activeDeviceConnections.map(conn => ({
    sessionId: conn._id,
    platform: conn.userAgent,
    originIP: conn.ip,
    connectedSince: conn.createdAt
  }));
};

export const clearAllAlternateSessions = async (userId, activeSessionToken) => {
  // Bulk invalidate every token across alternate platforms during an exploit response
  await Session.updateMany(
    { user: userId, refreshToken: { $ne: activeSessionToken } },
    { $set: { isValid: false } }
  );
};