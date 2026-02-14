const express = require('express');
const router = express.Router();
const districtController = require('../controllers/districtController');

// GET /api/districts - Get all districts
router.get('/', districtController.getDistricts);

// GET /api/districts/:id - Get district by ID
router.get('/:id', districtController.getDistrictById);

// GET /api/districts/:id/colleges - Get colleges in district
router.get('/:id/colleges', districtController.getCollegesInDistrict);

module.exports = router;
