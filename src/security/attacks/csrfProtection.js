import { secureCompare } from '../../utils/crypto.js';

export const csrfProtection = (req, res, next) => {
  // 1. Safe HTTP verbs do not alter database states, so bypass validations
  const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
  if (safeMethods.includes(req.method)) return next();

  // 2. Extract the token from the custom header (provided by frontend JavaScript)
  const headerToken = req.headers['x-csrf-token'];
  
  // 3. Extract the token from the secure browser cookie jar
  const cookieToken = req.cookies['csrfToken'];

  // 4. Deny outright if either component is missing
  if (!headerToken || !cookieToken) {
    return res.status(403).json({ 
      success: false, 
      message: 'CSRF Protection: Security verification token missing.' 
    });
  }

  // 5. Securely compare both tokens using constant-time evaluation to prevent timing attacks
  const isValid = secureCompare(headerToken, cookieToken);

  if (!isValid) {
    return res.status(403).json({ 
      success: false, 
      message: 'CSRF Protection: Security validation signature mismatch.' 
    });
  }

  next();
};