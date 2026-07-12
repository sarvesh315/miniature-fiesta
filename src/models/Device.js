import mongoose from 'mongoose';

const deviceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  deviceFingerprint: { type: String, required: true }, // Derived from hashing hardware/browser specs
  deviceName: { type: String, required: true },        // e.g., "Chrome on macOS"
  isTrusted: { type: Boolean, default: false },
  lastUsedAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Enforce compound index to keep combinations clean
deviceSchema.index({ user: 1, deviceFingerprint: 1 }, { unique: true });

export default mongoose.model('Device', deviceSchema);