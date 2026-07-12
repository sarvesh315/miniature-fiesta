import mongoose from 'mongoose';

const loginHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  status: { type: String, enum: ['success', 'failed_password', 'failed_otp', 'locked'], required: true },
  failureReason: { type: String, default: null }
}, { timestamps: true });

export default mongoose.model('LoginHistory', loginHistorySchema);