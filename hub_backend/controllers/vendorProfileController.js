const VendorProfile = require('../models/VendorProfile');

/**
 * @desc    Get the current user's vendor profile
 * @route   GET /api/vendor-profile/me
 * @access  Private
 */
const getMyVendorProfile = async (req, res) => {
    try {
        const profile = await VendorProfile.findOne({ userId: req.user.id });
        if (!profile) {
            return res.status(404).json({ message: 'No vendor profile found for this user.' });
        }
        res.json(profile);
    } catch (error) {
        console.error('Error fetching vendor profile:', error.message);
        res.status(500).json({ error: 'Server error while fetching profile.' });
    }
};

/**
 * @desc    Create or update a vendor profile
 * @route   POST /api/vendor-profile
 * @access  Private
 */
const createOrUpdateVendorProfile = async (req, res) => {
    try {
        const {
            companyName,
            description,
            services,
            manufacturerType,
            field,
            capabilities,
            photos,
            contactEmail,
            phone,
            website,
            address
        } = req.body;

        const profileData = {
            userId: req.user.id,
            companyName,
            description,
            services,
            manufacturerType,
            field,
            capabilities,
            photos: photos || [],
            contactEmail,
            phone,
            website,
            address,
            updatedAt: Date.now()
        };

        let profile = await VendorProfile.findOne({ userId: req.user.id });

        if (profile) {
            // Update
            profile = await VendorProfile.findOneAndUpdate(
                { userId: req.user.id },
                { $set: profileData },
                { new: true }
            );
            return res.json({ message: 'Vendor profile updated successfully', profile });
        }

        // Create
        profile = new VendorProfile(profileData);
        await profile.save();

        res.status(201).json({ message: 'Vendor profile created successfully', profile });
    } catch (error) {
        console.error('Error saving vendor profile:', error.message);
        res.status(500).json({ error: 'Server error while saving profile.' });
    }
};

module.exports = {
    getMyVendorProfile,
    createOrUpdateVendorProfile
};
