import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  refreshToken: { type: String, required: true, unique: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // MongoDB auto-deletes when current time hits this date
}, { timestamps: true });

export default mongoose.model('Session', sessionSchema);