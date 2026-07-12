import mongoose from 'mongoose';

const securityEventSchema = new mongoose.Schema({
  eventType: { type: String, enum: ['brute_force_attempt', 'xss_blocked', 'csrf_denied', 'unauthorized_access', 'password_rotation_enforced'], required: true, index: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], required: true },
  ip: { type: String, required: true },
  userAgent: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  details: { type: mongoose.Schema.Types.Mixed, required: true } // Stores flexible JSON object matching the threat profile
}, { timestamps: true });

export default mongoose.model('SecurityEvent', securityEventSchema);