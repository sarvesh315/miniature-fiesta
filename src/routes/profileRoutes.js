import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

console.log("protect:", protect);
console.log("getProfile:", userController.getProfile);
console.log("updateProfile:", userController.updateProfile);
console.log("requestStepUpToken:", userController.requestStepUpToken);
console.log("updatePassword:", userController.updatePassword);
router.get('/', userController.getProfile);
router.put('/', userController.updateProfile);

// Secure high-risk routes using explicit step-up parameters
router.post('/request-stepup', userController.requestStepUpToken);
router.put('/password', userController.updatePassword);

export default router;