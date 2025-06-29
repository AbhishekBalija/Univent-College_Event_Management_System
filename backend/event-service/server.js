const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Import routes
const eventRoutes = require('./src/routes/event.routes');

// Import error handler
const errorHandler = require('./src/middleware/error.middleware');

// Create Express app
const app = express();

// Set up rate limiter: max 500 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Increased limit from 100 to 500 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
})); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request body

// Import database connection
const connectDB = require('./src/config/db.config');

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/events', eventRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Event service is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use(errorHandler);

module.exports = app;

// Start server
const PORT = process.env.PORT || 8002;
app.listen(PORT, () => {
  console.log(`Event service running on port ${PORT}`);
});