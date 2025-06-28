const socketIO = require('socket.io');

/**
 * Initialize Socket.IO for real-time leaderboard updates
 * @param {Object} server - HTTP server instance
 * @returns {Object} Socket.IO instance and middleware
 */
const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || '*',
      methods: ['GET', 'POST']
    }
  });

  // Socket.IO namespace for leaderboard
  const leaderboardIO = io.of('/leaderboard');

  // Authentication middleware for socket connections
  leaderboardIO.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication error'));
    }
    
    // Simple validation - in production, verify JWT token
    next();
  });

  // Handle socket connections
  leaderboardIO.on('connection', (socket) => {
    console.log(`User connected to leaderboard: ${socket.id}`);

    // Join event-specific room
    socket.on('join-event', (eventId) => {
      socket.join(`event-${eventId}`);
      console.log(`User ${socket.id} joined event room: event-${eventId}`);
    });

    // Leave event-specific room
    socket.on('leave-event', (eventId) => {
      socket.leave(`event-${eventId}`);
      console.log(`User ${socket.id} left event room: event-${eventId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected from leaderboard: ${socket.id}`);
    });
  });

  // Middleware to attach socket.io to request object
  const socketMiddleware = (req, res, next) => {
    req.io = io;
    req.leaderboardIO = leaderboardIO;
    next();
  };

  return { io, leaderboardIO, socketMiddleware };
};

module.exports = initializeSocket;