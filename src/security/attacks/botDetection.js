const automatedScrapers = [
  'python-requests', 'curl', 'wget', 'postmanruntime', 'headlesschrome',
  'puppeteer', 'selenium', 'cyber-fingerprint', 'zgrab'
];

export const botDetection = (req, res, next) => {
  const userAgent = (req.headers['user-agent'] || '').toLowerCase();

  // 1. Check for standard scraper blueprints
  const isSuspiciousAgent = automatedScrapers.some(botName => userAgent.includes(botName));
  
  // 2. Headless check for common automation properties
  const isMissingCrucialHeaders = !req.headers['accept'] || !req.headers['accept-language'];

  if (isSuspiciousAgent || isMissingCrucialHeaders) {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Direct automated client connections are restricted.'
    });
  }

  next();
};