const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const UserSettings = require('../src/models/UserSettings');
const SystemSettings = require('../src/models/SystemSettings');
const jwt = require('jsonwebtoken');

// Mock JWT verification
jest.mock('jsonwebtoken');

// Sample user data
const testUser = {
  id: '60d0fe4f5311236168a109ca',
  role: 'participant'
};

const adminUser = {
  id: '60d0fe4f5311236168a109cb',
  role: 'admin'
};

// Sample settings data
const userSettingsData = {
  notification: {
    email: true,
    push: false,
    sms: true
  },
  theme: 'dark',
  language: 'spanish'
};

const systemSettingsData = {
  maxUsersPerEvent: 200,
  maxEventsPerOrganizer: 15,
  enableRegistration: false,
  loggingLevel: 'debug'
};

describe('Settings API', () => {
  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eventflow_settings_test', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Clean up and close connection
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear collections before each test
    await UserSettings.deleteMany({});
    await SystemSettings.deleteMany({});

    // Mock JWT verification
    jwt.verify.mockImplementation((token, secret, callback) => {
      if (token === 'admin_token') {
        return adminUser;
      }
      return testUser;
    });
  });

  describe('User Settings', () => {
    test('GET /api/settings/user - Should return user settings', async () => {
      // Create test user settings
      await UserSettings.create({
        userId: testUser.id,
        ...userSettingsData
      });

      const res = await request(app)
        .get('/api/settings/user')
        .set('Authorization', 'Bearer user_token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toEqual(testUser.id);
      expect(res.body.data.theme).toEqual(userSettingsData.theme);
    });

    test('PUT /api/settings/user - Should update user settings', async () => {
      const res = await request(app)
        .put('/api/settings/user')
        .set('Authorization', 'Bearer user_token')
        .send(userSettingsData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toEqual(testUser.id);
      expect(res.body.data.theme).toEqual(userSettingsData.theme);
      expect(res.body.data.language).toEqual(userSettingsData.language);
    });
  });

  describe('System Settings', () => {
    test('GET /api/settings/system - Should return system settings for admin', async () => {
      // Create test system settings
      await SystemSettings.create(systemSettingsData);

      const res = await request(app)
        .get('/api/settings/system')
        .set('Authorization', 'Bearer admin_token');

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.maxUsersPerEvent).toEqual(systemSettingsData.maxUsersPerEvent);
    });

    test('GET /api/settings/system - Should deny access to non-admin users', async () => {
      const res = await request(app)
        .get('/api/settings/system')
        .set('Authorization', 'Bearer user_token');

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });

    test('PUT /api/settings/system - Should update system settings for admin', async () => {
      const res = await request(app)
        .put('/api/settings/system')
        .set('Authorization', 'Bearer admin_token')
        .send(systemSettingsData);

      expect(res.statusCode).toEqual(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.maxUsersPerEvent).toEqual(systemSettingsData.maxUsersPerEvent);
      expect(res.body.data.loggingLevel).toEqual(systemSettingsData.loggingLevel);
    });

    test('PUT /api/settings/system - Should deny access to non-admin users', async () => {
      const res = await request(app)
        .put('/api/settings/system')
        .set('Authorization', 'Bearer user_token')
        .send(systemSettingsData);

      expect(res.statusCode).toEqual(403);
      expect(res.body.success).toBe(false);
    });
  });
});