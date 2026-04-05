const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes Placeholder
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'hub_backend' });
});

// Vendor Model Import (Needed for Admin endpoint)
const VendorProfile = require('./models/VendorProfile');
// Note: User Model would be required if pushing strict constraints, 
// but we'll bypass userId constraint in demo if not strictly provided.

// Proxy route for Search queries (Express -> FastAPI)
app.post('/api/search', async (req, res) => {
  try {
    const pythonResponse = await fetch('http://localhost:8000/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    
    if (!pythonResponse.ok) {
      throw new Error(`Python service responded with status: ${pythonResponse.status}`);
    }
    
    const data = await pythonResponse.json();
    return res.json(data);
  } catch (error) {
    console.error('Error proxying to FastAPI:', error.message);
    return res.status(500).json({ 
      error: 'Failed to process search request through ML microservice.',
      details: error.message 
    });
  }
});

// Admin Route to directly insert a Vendor Profile
app.post('/api/admin/company', async (req, res) => {
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
    
    // We use a mock ObjectId since Admin inserts might not belong to a specific User yet.
    // In production, an Admin user or System user ID would be attached.
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
});

// We can add more routes later (auth, vendors, etc.)

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/supplyadda';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });
