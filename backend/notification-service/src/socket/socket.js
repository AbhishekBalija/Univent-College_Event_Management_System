/**
 * Socket.io configuration and event handlers
 */

const socketIO = require('socket.io');

const initializeSocket = (server) => {
  const io = socketIO(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Socket middleware to attach io instance to request object
  const socketMiddleware = (req, res, next) => {
    req.io = io;
    next();
  };

  // Socket connection handler
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Join event-specific rooms
    socket.on('joinEvent', (eventId) => {
      socket.join(`event-${eventId}`);
      console.log(`Socket ${socket.id} joined room: event-${eventId}`);
    });

    // Leave event-specific rooms
    socket.on('leaveEvent', (eventId) => {
      socket.leave(`event-${eventId}`);
      console.log(`Socket ${socket.id} left room: event-${eventId}`);
    });

    // Handle user role-based rooms
    socket.on('joinUserRole', (role) => {
      if (['admin', 'organizer', 'participant'].includes(role)) {
        socket.join(`role-${role}`);
        console.log(`Socket ${socket.id} joined room: role-${role}`);
      }
    });

    // ✅ Test-only manual emit
    socket.on('testTriggerAnnouncement', ({ announcement }) => {
      console.log('[SOCKET] Triggering test announcement broadcast');
      io.to(`event-${announcement.eventId}`).emit('newAnnouncement', { announcement });
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });


  // Utility functions for emitting events
  const emitToAll = (event, data) => {
    io.emit(event, data);
  };

  const emitToEvent = (eventId, event, data) => {
    io.to(`event-${eventId}`).emit(event, data);
  };

  const emitToRole = (role, event, data) => {
    io.to(`role-${role}`).emit(event, data);
  };

  return {
    io,
    socketMiddleware,
    emitToAll,
    emitToEvent,
    emitToRole
  };
};

module.exports = initializeSocket;