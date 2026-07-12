import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email associated with this Google account'), null);
        }

        // Mock database schema fallback representation
        const mockUserPayload = {
          googleId: profile.id,
          email: email,
          name: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        };

        // Complete the authentication process
        return done(null, mockUserPayload);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;