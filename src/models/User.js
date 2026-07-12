import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { encryptField, decryptField } from '../security/encryption/dataEncryption.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },

    // High-value PII stored encrypted at rest
    phone: {
      type: String,
      default: null,
    },

    role: {
      type: String,
      enum: ['user', 'manager', 'admin'],
      default: 'user',
    },

    isTwoFactorEnabled: {
      type: Boolean,
      default: false,
    },

    isAccountLocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt phone before saving
userSchema.pre('save', function (next) {
  if (this.isModified('phone') && this.phone) {
    this.phone = encryptField(this.phone);
  }
  next();
});

// Decrypt phone after loading from MongoDB
userSchema.post('init', function (doc) {
  if (doc.phone) {
    try {
      doc.phone = decryptField(doc.phone);
    } catch {
  doc.phone = '[DECRYPTION_FAILURE_DEGRADED_KEY]';
}
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;