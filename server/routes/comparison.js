const express = require('express');
const router = express.Router();
const comparisonController = require('../controllers/comparisonController');

// POST /api/comparison/colleges - Compare colleges
router.post('/colleges', comparisonController.compareColleges);

// POST /api/comparison/courses - Compare courses
router.post('/courses', comparisonController.compareCourses);

// GET /api/comparison/suggestions/:collegeId - Get comparison suggestions
router.get('/suggestions/:collegeId', comparisonController.getComparisonSuggestions);

module.exports = router;
