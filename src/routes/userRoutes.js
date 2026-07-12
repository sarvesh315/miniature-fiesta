import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/permissionMiddleware.js';

const router = express.Router();

// All routes here require being logged in and authorized as an Admin/Manager
router.use(protect);
router.use(authorize('admin', 'manager'));

router.route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router.route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(authorize('admin'), userController.deleteUser); // Only admin can delete

export default router;