const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');

// GET /api/placements - Get placements with filters
router.get('/', placementController.getPlacements);

// GET /api/placements/college/:collegeId - Get placements by college
router.get('/college/:collegeId', placementController.getPlacementsByCollege);

// GET /api/placements/course/:courseId - Get placements by course
router.get('/course/:courseId', placementController.getPlacementsByCourse);

// GET /api/placements/statistics - Get placement statistics
router.get('/statistics', placementController.getPlacementStatistics);

// GET /api/placements/:id - Get placement by ID
router.get('/:id', placementController.getPlacementById);

// POST /api/placements - Create placement (admin only)
router.post('/', placementController.createPlacement);

// PUT /api/placements/:id - Update placement (admin only)
router.put('/:id', placementController.updatePlacement);

// DELETE /api/placements/:id - Delete placement (admin only)
router.delete('/:id', placementController.deletePlacement);

module.exports = router;
