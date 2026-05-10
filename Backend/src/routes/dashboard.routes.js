import express from 'express';
import { getDashboardStats, getAdminStats } from '../controller/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected route - only logged in users can access dashboard stats
router.get('/stats', protect, getDashboardStats);

// Admin route
router.get('/admin/stats', protect, getAdminStats);

export default router;

