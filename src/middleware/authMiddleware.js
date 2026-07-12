import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import TokenBlacklist from '../models/TokenBlacklist.js'; // Import the blocklist model
import { securityConfig } from '../config/securityConfig.js';

export const protect = async (req, res, next) => {
  let token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(token, securityConfig.jwt.accessTokenSecret);

    // CRITICAL FIX: Check if token has been invalidated early via logout
    const isBlacklisted = await TokenBlacklist.findOne({ jti: decoded.jti });
    if (isBlacklisted) {
      return res.status(401).json({ success: false, message: 'Session revoked. Please log in again.' });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.isAccountLocked) {
      return res.status(403).json({ success: false, message: 'Profile unavailable or locked.' });
    }

    req.user = user;
    next();
} catch {
  return res.status(401).json({ success: false, message: 'Session expired or manipulated.' });
}

};