const express = require('express');
const router = express.Router();
const { createVendorAdmin } = require('../controllers/vendorController');

// All vendor admin routes are prefixed with /api/admin/company in server.js
// But better to prefix with /api/vendors or something.
// For now, staying consistent with server.js: /api/admin/company
router.post('/admin/company', createVendorAdmin);

module.exports = router;
