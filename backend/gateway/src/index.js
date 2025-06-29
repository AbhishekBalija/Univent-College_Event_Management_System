const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Set up rate limiter: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Apply rate limiting to all requests
app.use(limiter);

// Middleware
app.use(helmet()); // Set security headers
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173'],
  credentials: true
})); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request body

// Service endpoints
const AUTH_SERVICE = process.env.AUTH_SERVICE || 'http://localhost:8001';
const EVENT_SERVICE = process.env.EVENT_SERVICE || 'http://localhost:8002';
const NOTIFICATION_SERVICE = process.env.NOTIFICATION_SERVICE || 'http://localhost:8003';
const LEADERBOARD_SERVICE = process.env.LEADERBOARD_SERVICE || 'http://localhost:8004';
const SETTINGS_SERVICE = process.env.SETTINGS_SERVICE || 'http://localhost:8005';

// Proxy middleware options
const proxyOptions = {
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': '/api/auth',
    '^/api/events': '/api/events',
    '^/api/notifications': '/api/notifications',
    '^/api/leaderboard': '/api/leaderboard',
    '^/api/settings': '/api/settings',
    '^/api/admin': '/api/admin'
  }
};

// Proxy routes
app.use('/api/auth', createProxyMiddleware({ ...proxyOptions, target: AUTH_SERVICE }));
app.use('/api/admin', createProxyMiddleware({ ...proxyOptions, target: AUTH_SERVICE }));
app.use('/api/events', createProxyMiddleware({ ...proxyOptions, target: EVENT_SERVICE }));
app.use('/api/notifications', createProxyMiddleware({ ...proxyOptions, target: NOTIFICATION_SERVICE }));
app.use('/api/leaderboard', createProxyMiddleware({ ...proxyOptions, target: LEADERBOARD_SERVICE }));
app.use('/api/settings', createProxyMiddleware({ ...proxyOptions, target: SETTINGS_SERVICE }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'API Gateway is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});