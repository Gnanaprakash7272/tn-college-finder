const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

// GET /api/search - Global search
router.get('/', searchController.globalSearch);

// GET /api/search/autocomplete - Autocomplete suggestions
router.get('/autocomplete', searchController.getAutocompleteSuggestions);

// POST /api/search/advanced - Advanced search
router.post('/advanced', searchController.advancedSearch);

module.exports = router;
