const xssRegex = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>|javascript:|onerror=|onload=/gi;

export const deepXssSanitizer = (data) => {
  if (typeof data === 'string') {
    return data.replace(xssRegex, '[REDACTED_POTENTIAL_XSS]');
  }
  
  if (typeof data === 'object' && data !== null) {
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        data[key] = deepXssSanitizer(data[key]);
      }
    }
  }
  return data;
};

export const xssProtectionMiddleware = (req, res, next) => {
  if (req.body) req.body = deepXssSanitizer(req.body);
  if (req.query) req.query = deepXssSanitizer(req.query);
  if (req.params) req.params = deepXssSanitizer(req.params);
  next();
};