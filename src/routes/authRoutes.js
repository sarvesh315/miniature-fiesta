import { Router } from 'express';
import passport from 'passport';
import { googleAuthCallbackController } from '../controllers/authController.js';

const router = Router();

// Endpoint initiating the Google redirection handoff loop
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google internal target endpoint landing location hook
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  googleAuthCallbackController
);

export default router;