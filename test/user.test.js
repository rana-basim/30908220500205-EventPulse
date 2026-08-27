const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const user = require('../models/user');
require('dotenv').config()

describe('user endpoints integration tests', () => {
  beforeAll(async () => {
    // Force fallback JWT secret for testing environment
    process.env.jwt_secret = process.env.jwt_secret || 'supersecretkey';

    await mongoose.connect(process.env.mongo_uri || 'mongodb://127.0.0.1:27017/eventpulse_test');
  });

  afterAll(async () => {
    await user.deleteMany({ email: /@example\.com$/ });
    await mongoose.connection.close();
  });

  test('POST /api/users/register - should return 422 on invalid input', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'invalid-email',
        password: '123',
      });

    expect(res.statusCode).toBe(422);
    expect(res.body.status).toBe('fail');
  });

  test('POST /api/users/register - should create user successfully', async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;

    const res = await request(app)
      .post('/api/users/register')
      .send({
        name: 'test user',
        email: uniqueEmail,
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });

  test('GET /api/unknown-route - should return 404 via central error handler', async () => {
    const res = await request(app).get('/api/unknown-route');

    expect(res.statusCode).toBe(404);
    expect(res.body.status).toBe('fail');
  });
});