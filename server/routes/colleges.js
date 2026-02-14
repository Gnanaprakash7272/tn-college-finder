const express = require('express');
const router = express.Router();
const collegeController = require('../controllers/collegeController');
const { validateCollege } = require('../middleware/validation');

// GET /api/colleges - Get all colleges with filters and pagination
router.get('/', collegeController.getColleges);

// GET /api/colleges/top - Get top colleges by NIRF ranking
router.get('/top', collegeController.getTopColleges);

// GET /api/colleges/district/:district - Get colleges by district
router.get('/district/:district', collegeController.getCollegesByDistrict);

// GET /api/colleges/type/:type - Get colleges by type
router.get('/type/:type', collegeController.getCollegesByType);

// GET /api/colleges/search - Search colleges by name or code
router.get('/search', collegeController.searchColleges);

// GET /api/colleges/:id - Get college by ID
router.get('/:id', collegeController.getCollegeById);

// POST /api/colleges - Create new college (admin only)
router.post('/', validateCollege, collegeController.createCollege);

// PUT /api/colleges/:id - Update college (admin only)
router.put('/:id', validateCollege, collegeController.updateCollege);

// DELETE /api/colleges/:id - Delete college (admin only)
router.delete('/:id', collegeController.deleteCollege);

// GET /api/colleges/:id/courses - Get all courses for a college
router.get('/:id/courses', collegeController.getCollegeCourses);

// GET /api/colleges/:id/cutoffs - Get cutoffs for a college
router.get('/:id/cutoffs', collegeController.getCollegeCutoffs);

// GET /api/colleges/:id/placements - Get placement data for a college
router.get('/:id/placements', collegeController.getCollegePlacements);

// GET /api/colleges/:id/statistics - Get comprehensive statistics for a college
router.get('/:id/statistics', collegeController.getCollegeStatistics);

module.exports = router;
