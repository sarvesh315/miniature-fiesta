import express from 'express';
import * as fileController from '../controllers/fileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect);

// Global express.json limits might be 1MB, but we set a strict 5MB barrier explicitly on the upload line
const uploadSizeGuard = express.raw({ 
  type: 'multipart/form-data', 
  limit: '5mb' 
});

router.post('/upload', uploadSizeGuard, fileController.uploadFile);
router.get('/', fileController.getUserFiles);

export default router;