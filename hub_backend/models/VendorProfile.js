const mongoose = require('mongoose');

const vendorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  companyName: { type: String, required: true },
  description: { type: String, required: true },
  services: [{ type: String }],
  categories: [{ type: String }],
  manufacturerType: { type: String, enum: ['OEM', 'Job Work', 'Distributor', 'Other'] },
  field: { type: String },
  capabilities: [{ type: String }],
  photos: [{ type: String }], // Cloud URL endpoints
  contactEmail: { type: String, required: true },
  phone: { type: String },
  website: { type: String },
  address: {
    zone: { type: String, enum: ['North', 'South', 'East', 'West', 'Central', 'North East'] },
    state: String,
    district: String,
    city: String,
    pincode: String,
    country: { type: String, default: 'India' }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VendorProfile', vendorProfileSchema);
