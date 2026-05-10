import express from 'express';
import { addStop, getStops, deleteStop } from '../controller/stopController.js';
import { protect } from '../middleware/authMiddleware.js';

// Router is created with mergeParams: true because it will be nested under tripRoutes
const router = express.Router({ mergeParams: true });

router.route('/')
  .post(protect, addStop)
  .get(protect, getStops);

router.route('/:id')
  .delete(protect, deleteStop);

export default router;
