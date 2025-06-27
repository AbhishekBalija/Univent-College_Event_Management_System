const { io } = require('socket.io-client');

describe('Notification WebSocket API', () => {
  let socket;
  const testEventId = 'test123';

  beforeAll((done) => {
    socket = io('http://localhost:8003', {
      transports: ['websocket'],
      reconnection: false
    });

    socket.on('connect', () => {
      console.log('[✅] Connected to WebSocket server');
      done();
    });

    socket.on('connect_error', (err) => {
      console.error('❌ WebSocket connection failed:', err.message);
      done(err);
    });
  });

  afterAll(() => {
    if (socket && socket.connected) {
      socket.disconnect();
    }
  });

  test('should join an event room and receive newAnnouncement', (done) => {
    socket.on('newAnnouncement', (payload) => {
      console.log('[📩] newAnnouncement received:', payload);
      expect(payload).toHaveProperty('announcement');
      expect(payload.announcement).toHaveProperty('title');
      done();
    });

    socket.emit('joinEvent', testEventId);

    setTimeout(() => {
      socket.emit('testTriggerAnnouncement', {
        announcement: {
          title: 'Test Real-Time Announcement',
          content: 'This is a test via WebSocket',
          eventId: testEventId
        }
      });
    }, 1000);
  }, 10000);
});
