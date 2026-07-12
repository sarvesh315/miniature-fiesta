import express from 'express';
import * as securityController from '../controllers/securityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/2fa/enable', securityController.enable2FA);
router.post('/2fa/disable', securityController.disable2FA);
router.get('/security-logs', securityController.getSecurityEvents);

export default router;