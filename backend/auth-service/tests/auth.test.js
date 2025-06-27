const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Adjust this if your server is in a different path

describe('Auth API', () => {
  const testEmail = `testuser${Date.now()}@example.com`;
  const password = 'testpassword123';
  let token = '';

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        firstName: 'Test',
        lastName: 'User',
        email: testEmail,
        password,
        college: 'EventFlow University'
      });

    expect(res.statusCode).toBe(201); // ✅ Register should return 201
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testEmail);
    expect(res.body.token).toBeDefined();
  });

  it('should login the user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password
      });

    expect(res.statusCode).toBe(200); // ✅ Login should return 200
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();

    token = res.body.token;
  });

  it('should get current user profile', async () => {
    if (!token) throw new Error('Token not set from login test');

    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200); // ✅ Get profile returns 200
    expect(res.body.success).toBe(true);
    expect(res.body.user.email).toBe(testEmail);
  });

  // Optional: close DB connection to clean up Jest properly
  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // let pending ops finish
    await mongoose.connection.close(); // if using Mongoose
  });
});
