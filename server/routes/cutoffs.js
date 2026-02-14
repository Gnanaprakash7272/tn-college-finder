const express = require('express');
const router = express.Router();
const cutoffController = require('../controllers/cutoffController');
const { validateCutoff } = require('../middleware/validation');

// GET /api/cutoffs - Get all cutoffs with filters
router.get('/', cutoffController.getCutoffs);

// GET /api/cutoffs/latest - Get latest cutoff for college and course
router.get('/latest', cutoffController.getLatestCutoff);

// GET /api/cutoffs/year-community - Get cutoffs by year and community
router.get('/year-community', cutoffController.getCutoffsByYearAndCommunity);

// GET /api/cutoffs/historical - Get historical cutoffs for prediction
router.get('/historical', cutoffController.getHistoricalCutoffs);

// GET /api/cutoffs/trends - Get cutoff trends
router.get('/trends', cutoffController.getCutoffTrends);

// GET /api/cutoffs/within-range - Find colleges within cutoff range
router.get('/within-range', cutoffController.findCollegesWithinCutoff);

// GET /api/cutoffs/:id - Get cutoff by ID
router.get('/:id', cutoffController.getCutoffById);

// POST /api/cutoffs - Create new cutoff (admin only)
router.post('/', validateCutoff, cutoffController.createCutoff);

// PUT /api/cutoffs/:id - Update cutoff (admin only)
router.put('/:id', validateCutoff, cutoffController.updateCutoff);

// DELETE /api/cutoffs/:id - Delete cutoff (admin only)
router.delete('/:id', cutoffController.deleteCutoff);

module.exports = router;
