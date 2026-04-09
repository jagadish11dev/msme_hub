const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phoneNumber: { type: String, required: true, unique: true },
  city: { type: String, required: true },
  email: { type: String, required: false },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'vendor', 'admin'], default: 'buyer' },
  isVerified: { type: Boolean, default: false },
  otp: { type: String },
  otpExpires: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
