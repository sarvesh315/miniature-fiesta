import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, index: true },
  code: { type: String, required: true },
  purpose: { type: String, enum: ['login', 'register', 'password_reset', '2fa_toggle'], required: true },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now, index: { expires: 300 } } // Document auto-expires exactly 5 mins after generation
});

export default mongoose.model('OTP', otpSchema);