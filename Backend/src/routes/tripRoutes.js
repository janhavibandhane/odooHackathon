import express from 'express';
import { 
  createTrip, 
  getMyTrips, 
  getTripById, 
  getPublicTrip,
  updateTrip, 
  deleteTrip,
  cloneTrip,
  updateTripBudget, 
  updateTripPackingList, 
  updateTripNotes 
} from '../controller/tripController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createTrip)
  .get(protect, getMyTrips);

// Public route for shared itineraries
router.route('/public/:id')
  .get(getPublicTrip);

router.route('/:id')
  .get(protect, getTripById)
  .put(protect, updateTrip)
  .delete(protect, deleteTrip);

router.route('/:id/clone')
  .post(protect, cloneTrip);

router.route('/:id/budget')
  .put(protect, updateTripBudget);

router.route('/:id/packing')
  .put(protect, updateTripPackingList);

router.route('/:id/notes')
  .put(protect, updateTripNotes);

export default router;

