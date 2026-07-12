import * as securityService from '../../services/securityService.js';

const sqlPattern = /UNION\s+SELECT|SELECT\s+.*\s+FROM|--/gi;

export const detectInjections = async (req, res, next) => {
  const requestStringified = JSON.stringify({ body: req.body, query: req.query });

  if (sqlPattern.test(requestStringified)) {
    await securityService.flagSecurityAnomaly(
      'unauthorized_access',
      'critical',
      req.ip,
      req.headers['user-agent'],
      req.user?._id || null,
      { threatProfile: 'SQL_PROBE_IDENTIFIED' }
    );
    
    return res.status(400).json({ success: false, message: 'Malicious payload signature detected.' });
  }

  next();
};