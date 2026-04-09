const express = require('express');
const router = express.Router();
const { getMyVendorProfile, createOrUpdateVendorProfile } = require('../controllers/vendorProfileController');
const auth = require('../middleware/auth');

// @route   GET /api/vendor-profile/me
// @desc    Get the current user's vendor profile
// @access  Private
router.get('/me', auth, getMyVendorProfile);

// @route   POST /api/vendor-profile
// @desc    Create or update a vendor profile
// @access  Private
router.post('/', auth, createOrUpdateVendorProfile);

module.exports = router;
