require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database'); // Initialize database
const reportsRoutes = require('./routes/reports');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from 'uploads' directory (for local fallback)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/reports', reportsRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'Factory Parking Management API is running perfectly!',
        cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'not_configured'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    if (process.env.CLOUDINARY_CLOUD_NAME) {
        console.log(`Cloudinary configured for cloud: ${process.env.CLOUDINARY_CLOUD_NAME}`);
    }
});
