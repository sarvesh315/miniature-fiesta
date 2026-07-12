import * as otpService from '../services/otpService.js';
import * as authService from '../services/authService.js';

// User must hit this first to receive an OTP before changing passwords
export const requestStepUpToken = async (req, res, next) => {
  try {
    await otpService.generateAndSendOTP(req.user.email, 'password_reset');

    res.status(200).json({
      success: true,
      message: 'Security code dispatched to your verified email.'
    });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword, securityCode } = req.body;

    if (!securityCode) {
      return res.status(403).json({
        success: false,
        message: 'Step-up verification code is required for this action.'
      });
    }

    const isVerified = await otpService.verifyOTPCode(
      req.user.email,
      securityCode,
      'password_reset'
    );

    if (!isVerified) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired security code.'
      });
    }

    await authService.changeUserPassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    res.status(200).json({
      success: true,
      message: 'Password rotated successfully.'
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: 'Profile retrieved successfully.',
      user: {
        id: req.user?.id || null,
        name: 'Demo User',
        email: 'demo@example.com'
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, email, phone } = req.body;

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      updated: {
        name,
        email,
        phone
      }
    });
  } catch (error) {
    next(error);
  }
};