import * as securityService from '../../services/securityService.js';

export const analyzeBehavior = async (req, res, next) => {
  // Track unexpected structural conditions
  const hasSuspiciousQueryCombo = req.query && Object.keys(req.query).length > 15;
  const isExploitPathHunting = req.originalUrl.includes('.env') || req.originalUrl.includes('wp-admin');

  if (isExploitPathHunting || hasSuspiciousQueryCombo) {
    await securityService.flagSecurityAnomaly(
      'unauthorized_access',
      'critical',
      req.ip,
      req.headers['user-agent'],
      req.user?._id || null,
      { pathTargeted: req.originalUrl, queryComplexity: Object.keys(req.query).length }
    );

    return res.status(400).json({ success: false, message: 'Security parameters breached. Access revoked.' });
  }

  next();
};