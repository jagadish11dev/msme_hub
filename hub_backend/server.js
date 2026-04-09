const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const searchRoutes = require('./routes/searchRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const authRoutes = require('./routes/authRoutes');
const vendorProfileRoutes = require('./routes/vendorProfileRoutes');

app.use('/api/search', searchRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/vendor-profile', vendorProfileRoutes);
app.use('/api', vendorRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'hub_backend' });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
