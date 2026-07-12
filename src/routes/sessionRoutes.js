import express from 'express';
import * as sessionController from '../controllers/sessionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', sessionController.getActiveSessions);
router.delete('/:id', sessionController.revokeSession);
router.delete('/', sessionController.revokeAllSessions); // Clear everything except current

export default router;