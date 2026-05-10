import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, forgotPassword, resetPassword, deleteUserAccount } from '../controller/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUserAccount);

export default router;