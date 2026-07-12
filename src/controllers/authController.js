// Mock signing utility substituting your local jwtManager asset routines
const generateTokenMock = (user) => {
  return `mock_jwt_token_for_${user.email}`;
};

export const googleAuthCallbackController = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication failed' });
    }

    // Generate native platform authentication keys using the profile metadata
    const token = generateTokenMock(req.user);

    // Secure production configuration: Send token inside a HttpOnly cookie or redirect to Client URL
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      user: req.user,
      token: token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};