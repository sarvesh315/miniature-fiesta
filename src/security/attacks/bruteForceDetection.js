import * as securityService from '../../services/securityService.js';

const failureCache = new Map();

export const bruteForceDetection = {
  logFailure: async (ip, endpoint) => {
    const key = `${ip}:${endpoint}`;
    const now = Date.now();
    
    if (!failureCache.has(key)) {
      failureCache.set(key, { count: 1, resetTime: now + 15 * 60 * 1000 }); // 15-minute tracking window
      return;
    }

    const data = failureCache.get(key);
    if (now > data.resetTime) {
      data.count = 1;
      data.resetTime = now + 15 * 60 * 1000;
    } else {
      data.count += 1;
    }

    // Flag as critical if structural failure thresholds are crossed
    if (data.count >= 10) {
      await securityService.flagSecurityAnomaly(
        'brute_force_attempt',
        'high',
        ip,
        'system-monitor',
        null,
        { targetEndpoint: endpoint, attemptsRecorded: data.count }
      );
    }
  },

  isThrottled: (ip, endpoint) => {
    const key = `${ip}:${endpoint}`;
    const data = failureCache.get(key);
    if (data && Date.now() < data.resetTime && data.count > 20) {
      return true; // Deny outright if thresholds are fully breached
    }
    return false;
  }
};

// Middleware wrapper for routing layers
export const enforceBruteGuard = (req, res, next) => {
  if (bruteForceDetection.isThrottled(req.ip, req.originalUrl)) {
    return res.status(429).json({ success: false, message: 'Too many authentication failures. Route temporarily unavailable.' });
  }
  next();
};