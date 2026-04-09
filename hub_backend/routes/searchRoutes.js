const express = require('express');
const router = express.Router();
const { searchProducts } = require('../controllers/searchController');

// All search routes are prefixed with /api/search in server.js
router.post('/', searchProducts);

module.exports = router;
