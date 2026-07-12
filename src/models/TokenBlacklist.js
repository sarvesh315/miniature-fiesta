import mongoose from 'mongoose';

const tokenBlacklistSchema = new mongoose.Schema({
  jti: { type: String, required: true, unique: true, index: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } } // MongoDB automatically drops this entry when this timestamp hits
});

export default mongoose.model('TokenBlacklist', tokenBlacklistSchema);