const express = require('express');
const auth = require('../middleware/auth');
const {
  generateItinerary,
  saveTrip,
  getUserTrips,
  deleteTrip
} = require('../controllers/tripController');
const router = express.Router();

const { tripLimiter } = require('../middleware/rateLimiter');
const { validate, generateTripSchema } = require('../middleware/validator');

// Public route
router.post('/generate', tripLimiter, validate(generateTripSchema), generateItinerary);

// Protected routes (optional - user can be authenticated or not)
router.post('/save', auth, saveTrip);
router.get('/', auth, getUserTrips);
router.delete('/:tripId', auth, deleteTrip);

module.exports = router;
