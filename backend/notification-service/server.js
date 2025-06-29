const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import database connection
const connectDB = require('./src/config/db.config');

// Import routes
const announcementRoutes = require('./src/routes/announcement.routes');

// Import middleware
const errorHandler = require('./src/middleware/error.middleware');

// Import socket.io initialization
const initializeSocket = require('./src/socket/socket');

// Initialize Express app
const app = express();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const { socketMiddleware } = initializeSocket(server);

// Connect to MongoDB
connectDB();

// Apply middleware
app.use(helmet());
app.use(cors({
  origin: [process.env.CLIENT_URL, 'http://localhost:5173', 'https://univento.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json());

// Apply rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Apply socket middleware to routes
app.use(socketMiddleware);

// Define routes
app.use('/api/announcements', announcementRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'notification-service' });
});

// Error handling middleware
app.use(errorHandler);

// Handle 404 routes
app.all('/{*any}', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`
  });
});


// Start server
const PORT = process.env.PORT || 8003;
server.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
});

// Export app for testing
module.exports = app;

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});