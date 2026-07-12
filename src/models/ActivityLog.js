import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true }, // e.g., "PROFILE_UPDATE", "FILE_DOWNLOAD"
  resource: { type: String, required: true }, // e.g., "User", "File"
  resourceId: { type: mongoose.Schema.Types.ObjectId, default: null },
  ip: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('ActivityLog', activityLogSchema);