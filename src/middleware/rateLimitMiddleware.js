import RateLimit from '../models/RateLimit.js';
import { securityConfig } from '../config/securityConfig.js';

const createLimiter = (windowMs, maxRequests, failureMessage) => {
  return async (req, res, next) => {
    const ip = req.ip || '0.0.0.0';
    const endpoint = req.baseUrl + req.path;
    const dbKey = `${ip}:${endpoint}`;
    const now = new Date();

    try {
      // Find current request bucket or construct a fresh one if missing
      let rateRecord = await RateLimit.findOne({ key: dbKey });

      if (!rateRecord) {
        const expireAt = new Date(now.getTime() + windowMs);
        await RateLimit.create({
          key: dbKey,
          points: 1,
          expireAt
        });
        return next();
      }

      if (rateRecord.points >= maxRequests) {
        return res.status(429).json({ success: false, message: failureMessage });
      }

      // Increment points count
      rateRecord.points += 1;
      await rateRecord.save();
      next();
} catch (error) {
  console.error("Rate limiter database error:", error);
  next();
}
  };
};

export const globalRateLimiter = createLimiter(
  securityConfig.rateLimits.globalWindow,
  securityConfig.rateLimits.globalMax,
  'Too many requests from this IP address. Please slow down.'
);

export const authRateLimiter = createLimiter(
  securityConfig.rateLimits.authWindow,
  securityConfig.rateLimits.authMax,
  'Too many login attempts recorded. This validation line has been throttled.'
);