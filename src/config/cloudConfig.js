import dotenv from 'dotenv';
dotenv.config();

export const cloudConfig = {
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || '',
    apiKey: process.env.CLOUDINARY_API_KEY || '',
    apiSecret: process.env.CLOUDINARY_API_SECRET || '',
  },
  
  // Enforced file upload limits for your validation middlewares
  uploads: {
    maxFileSize: 10 * 1024 * 1024, // Cloudinary comfortably handles up to 10MB raw files on free tier
    allowedMimeTypes: [
      'image/jpeg', 
      'image/png', 
      'image/webp',
      'application/pdf'
    ]
  }
};