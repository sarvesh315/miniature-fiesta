import { securityConfig } from '../config/securityConfig.js';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const policy = securityConfig.passwordPolicy;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: 'All registration parameters are required.' });
  }

  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email syntax layout.' });
  }

  if (password.length < policy.minLength) {
    return res.status(400).json({ success: false, message: `Password must be at least ${policy.minLength} characters long.` });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password credentials required.' });
  }

  next();
};