import mongoose from 'mongoose';

const rateLimitSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true }, // composite format: "ip:endpoint"
  points: { type: Number, default: 1 },
  expireAt: { type: Date, required: true, index: { expires: 0 } }  // Auto-purges when current time matches this date
});

export default mongoose.model('RateLimit', rateLimitSchema);