import express from 'express';
import { searchCities, searchActivities } from '../controller/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// We will protect these routes so only logged in users can use the AI,
// which prevents public abuse of the API key
router.post('/cities', protect, searchCities);
router.post('/activities', protect, searchActivities);

export default router;
