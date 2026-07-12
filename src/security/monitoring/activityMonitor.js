import ActivityLog from '../../models/ActivityLog.js';
import crypto from 'crypto';

export const logUserActivity = async (req, action, resource, resourceId = null) => {
  try {
    if (!req.user) return;

    // 1. Fetch the absolute latest chronological log entry to get its hash
    const lastLog = await ActivityLog.findOne().sort({ createdAt: -1 });
    const previousLogHash = lastLog ? lastLog.currentHash : '00000000000000000000000000000000';

    const ipAddress = req.ip || '0.0.0.0';
    const timestamp = new Date().toISOString();

    // 2. Construct an explicit payload string
    const blockPayload = `${req.user._id}-${action}-${resource}-${resourceId}-${ipAddress}-${timestamp}-${previousLogHash}`;

    // 3. Generate the cryptographic signature for the current entry
    const currentHash = crypto
      .createHmac('sha256', process.env.ENCRYPTION_SECRET)
      .update(blockPayload)
      .digest('hex');

    // 4. Save the document alongside its validation hashes
    await ActivityLog.create({
      user: req.user._id,
      action,
      resource,
      resourceId,
      ip: ipAddress,
      details: {
        parentHash: previousLogHash,
        currentHash: currentHash
      }
    });
  } catch (error) {
    console.error(`🚨 Immutable monitoring integrity stream broken: ${error.message}`);
  }
};