import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  originalName: { type: String, required: true },
  mimeType: { type: String, required: true },
  size: { type: Number, required: true }, // In bytes
  cloudUrl: { type: String, required: true }, // Pointer to free Cloudinary asset
  cloudPublicId: { type: String, required: true }, // Required for asset removal from cloud host
  isEncrypted: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('File', fileSchema);s