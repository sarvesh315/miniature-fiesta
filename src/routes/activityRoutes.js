import express from 'express';
import * as activityController from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', activityController.getActivityLogs);

export default router;