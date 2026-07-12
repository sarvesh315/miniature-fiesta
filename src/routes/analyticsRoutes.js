import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/permissionMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Exclusively locked down for administrators

router.get('/dashboard-summary', analyticsController.getSystemSummary);
router.get('/threat-metrics', analyticsController.getThreatMetrics);

export default router;