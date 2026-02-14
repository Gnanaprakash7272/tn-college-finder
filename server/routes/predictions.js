const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

// GET /api/predictions/cutoff - Get cutoff predictions
router.get('/cutoff', predictionController.getCutoffPredictions);

// GET /api/predictions/placement - Get placement predictions
router.get('/placement', predictionController.getPlacementPredictions);

// GET /api/predictions/probability - Get admission probability
router.get('/probability', predictionController.getAdmissionProbability);

// POST /api/predictions/recommendations - Get college recommendations
router.post('/recommendations', predictionController.getCollegeRecommendations);

module.exports = router;
