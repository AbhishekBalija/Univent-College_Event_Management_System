const request = require('supertest');
const axios = require('axios');
const mongoose = require('mongoose');
const app = require('../server');

const authUrl = 'http://localhost:8001/api/auth'; // Ensure auth-service is running
let organizerToken = '';
let participantToken = '';
let eventId = '';

const testOrganizer = {
  email: `org${Date.now()}@test.com`,
  password: 'password123',
};

const testParticipant = {
  email: `user${Date.now()}@test.com`,
  password: 'password123',
};

beforeAll(async () => {
  try {
    // Register Organizer
    const regOrg = await request(authUrl)
      .post('/register')
      .send({
        firstName: 'Org',
        lastName: 'User',
        email: testOrganizer.email,
        password: testOrganizer.password,
        college: 'Event University'
      });

    console.log('[✅] Organizer registered:', regOrg.body);
    const orgId = regOrg.body.user.id;

    // ✅ Use axios to promote to organizer
    const promoteRes = await axios.put(
      `http://localhost:8001/api/admin/users/${orgId}/role`,
      { role: 'organizer' },
      { headers: { Authorization: `Bearer ${regOrg.body.token}` } }
    );

    console.log('[✅] Promoted to organizer:', promoteRes.status);

    // Login as Organizer
    const loginOrg = await request(authUrl)
      .post('/login')
      .send({
        email: testOrganizer.email,
        password: testOrganizer.password
      });

    console.log('[✅] Organizer logged in:', loginOrg.body);
    organizerToken = loginOrg.body.token;

    // Register Participant
    await request(authUrl)
      .post('/register')
      .send({
        firstName: 'Part',
        lastName: 'User',
        email: testParticipant.email,
        password: testParticipant.password,
        college: 'Event University'
      });

    // Login as Participant
    const loginPart = await request(authUrl)
      .post('/login')
      .send({
        email: testParticipant.email,
        password: testParticipant.password
      });

    console.log('[✅] Participant logged in:', loginPart.body);
    participantToken = loginPart.body.token;

  } catch (error) {
    console.error('❌ beforeAll setup failed:', error.message);
    throw error;
  }
});

describe('Event Service', () => {
  it('should create a new event', async () => {
    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${organizerToken}`)
      .send({
        title: 'Test Event',
        description: 'This is a test event',
        date: new Date().toISOString(),
        location: 'Main Hall',
        capacity: 100,
        tags: ['test', 'workshop'],
        organizerName: 'Org User',
        image: 'https://example.com/image.png'
      });

    console.log('[📦] Create Event Response:', res.body);

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.event.title).toBe('Test Event');
    eventId = res.body.event._id;
  });

  it('should allow participant to register for the event', async () => {
    const res = await request(app)
      .post(`/api/events/${eventId}/register`)
      .set('Authorization', `Bearer ${participantToken}`)
      .send({
        specialRequirements: 'None'
      });

    console.log('[📝] Registration Response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('should get participants of the event', async () => {
    const res = await request(app)
      .get(`/api/events/${eventId}/participants`)
      .set('Authorization', `Bearer ${organizerToken}`);

    console.log('[👥] Participants Response:', res.body);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.participants)).toBe(true);
    expect(res.body.participants.length).toBeGreaterThan(0);
  });
});

afterAll(async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  await mongoose.connection.close();
});
