const express = require('express');
const {
  getSmartRecommendations,
  generateThemedPlan,
  optimizeRoute,
  getPlaceDetails,
  calculateDistance,
  getCuratedPlaces,
  getExploreDestinations
} = require('../controllers/placesController');

const router = express.Router();

// Smart recommendations with distance and travel time
router.post('/recommendations', getSmartRecommendations);

// Themed trip plans (romantic, food, cultural, etc.)
router.post('/themed-plan', generateThemedPlan);

// Route optimization
router.post('/optimize-route', optimizeRoute);

// Place details with reviews and ratings
router.post('/details', getPlaceDetails);

// Calculate distance from user location to destination
router.post('/calculate-distance', calculateDistance);

// Get curated places with real photos
router.post('/curated', getCuratedPlaces);

// Get explore destinations with real images
router.get('/explore-destinations', getExploreDestinations);

module.exports = router;
