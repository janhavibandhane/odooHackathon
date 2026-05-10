import express from 'express';
import { addActivity, getActivities, deleteActivity } from '../controller/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .post(protect, addActivity)
  .get(protect, getActivities);

router.route('/:id')
  .delete(protect, deleteActivity);

export default router;
