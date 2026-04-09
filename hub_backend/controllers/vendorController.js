const mongoose = require('mongoose');
const VendorProfile = require('../models/VendorProfile');

/**
 * @desc    Admin insertion of Vendor Profile
 * @route   POST /api/admin/company
 * @access  Private (Admin Role Needed, Placeholder for now)
 */
const createVendorAdmin = async (req, res) => {
    try {
        const { 
            companyName, 
            description, 
            contactEmail, 
            services, 
            zone,
            state,
            city,
            pincode,
            manufacturerType,
            field,
            capabilities,
            photos
        } = req.body;
        
        // Mock ObjectId for now, as in server.js demo.
        const dummyUserId = new mongoose.Types.ObjectId(); 

        const newVendor = new VendorProfile({
            userId: dummyUserId,
            companyName,
            description,
            contactEmail,
            services,
            manufacturerType,
            field,
            capabilities,
            photos: photos || [],
            address: { zone, state, district: city, city, pincode }
        });

        await newVendor.save();
        return res.status(201).json({ message: 'Vendor manually created by Admin', vendor: newVendor });
    } catch (error) {
        console.error('Error adding vendor:', error);
        return res.status(500).json({ error: 'Failed to save vendor details.' });
    }
};

module.exports = {
    createVendorAdmin
};
