import express from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

// 1. Lifecycle Configuration Initializations
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 2. Global Parsing & Engine Middleware Matrix
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// 3. Native Passport Google OAuth2 Strategy Registration
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'MOCK_CLIENT_ID',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'MOCK_SECRET',
      callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/v1/auth/google/callback',
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email associated with this Google account'), null);
        }

        // Object instance mapping representing your model identity
        const userPayload = {
          googleId: profile.id,
          email,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        };

        return done(null, userPayload);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// 4. Global API Endpoint Gateway Routing

// Core Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Route initiating the Google redirection handoff loop
app.get('/api/v1/auth/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google internal landing location callback hook
app.get(
  '/api/v1/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication failed' });
      }

      // Generate localized authentication signature string
      const token = `mock_jwt_token_for_${req.user.email}`;

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      });

      return res.status(200).json({
        success: true,
        message: 'Google authentication successful',
        user: req.user,
        token
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }
);

// 5. Global Fallback Error Interceptor
app.use((err, req, res, _next) => {
  console.error(`💥 Runtime Exception Catch: ${err.message}`);
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred.' 
      : err.message
  });
});

// 6. Server Initialization Lifecycle
const server = app.listen(PORT, () => {
  console.log(`🚀 Server fully operational and listening on port ${PORT}`);
});

// Graceful Termination Lifecycles
const handleExit = (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down connection layers gracefully...`);
  server.close(() => {
    console.log('🏁 Server closed down. Process exited clean.');
    process.exit(0);
  });
};

process.on('SIGTERM', () => handleExit('SIGTERM'));
process.on('SIGINT', () => handleExit('SIGINT'));