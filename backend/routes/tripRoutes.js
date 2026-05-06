const express = require('express');
const auth = require('../middleware/auth');
const {
  generateItinerary,
  saveTrip,
  getUserTrips,
  deleteTrip
} = require('../controllers/tripController');
const router = express.Router();

// Public route
router.post('/generate', generateItinerary);

// Protected routes (optional - user can be authenticated or not)
router.post('/save', auth, saveTrip);
router.get('/', auth, getUserTrips);
router.delete('/:tripId', auth, deleteTrip);

module.exports = router;
