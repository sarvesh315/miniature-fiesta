import express from 'express';
import * as deviceController from '../controllers/deviceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', deviceController.getRememberedDevices);
router.post('/:id/trust', deviceController.trustDevice);
router.delete('/:id', deviceController.forgetDevice);

export default router;