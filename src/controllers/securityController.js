import * as securityService from '../services/securityService.js';

export const enable2FA = async (req, res, next) => {
  try {
    await securityService.toggleMFAState(req.user.id, true);
    res.status(200).json({ success: true, message: 'Two-factor enforced globally on profile.' });
  } catch (error) {
    next(error);
  }
};

export const disable2FA = async (req, res, next) => {
  try {
    await securityService.toggleMFAState(req.user.id, false);
    res.status(200).json({ success: true, message: 'Two-factor bypassed.' });
  } catch (error) {
    next(error);
  }
};

export const getSecurityEvents = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, logs: [] });
  } catch (error) {
    next(error);
  }
};