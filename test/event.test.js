const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../app');
const event = require('../models/event');
const category = require('../models/category');
const user = require('../models/user');
require('dotenv').config()

describe('events api integration tests', () => {
  let admintoken;
  let adminid;
  let samplecategoryid;

  beforeAll(async () => {
    // Force fallback JWT secret for testing environment
    process.env.jwt_secret = process.env.jwt_secret || 'supersecretkey';

    await mongoose.connect(process.env.mongo_uri || 'mongodb://127.0.0.1:27017/eventpulse_test');

    const admin = await user.create({
      name: 'test admin',
      email: `admin_test_${Date.now()}@eventpulse.com`,
      password: 'password123',
      role: 'admin',
    });

    adminid = admin._id;

    admintoken = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.jwt_secret,
      { expiresIn: '1d' }
    );

    const cat = await category.create({
      name: `test category ${Date.now()}`,
      description: 'testing category setup',
    });
    samplecategoryid = cat._id;
  });

  afterEach(async () => {
    await event.deleteMany({});
  });

  afterAll(async () => {
    await category.deleteMany({});
    await user.deleteMany({});
    await mongoose.connection.close();
  });

  test('POST /api/events - should create a new event when authenticated as admin', async () => {
    const newevent = {
      title: 'jest test summit',
      description: 'testing event creation with supertest',
      date: '2026-11-20T10:00:00.000Z',
      city: 'cairo',
      capacity: 50,
      category: samplecategoryid,
    };

    const res = await request(app)
      .post('/api/events')
      .set('Authorization', `Bearer ${admintoken}`)
      .send(newevent);

    expect(res.statusCode).toBe(201);
    expect(res.body.status).toBe('success');
  });

  test('GET /api/events - should list all events', async () => {
    await event.create({
      title: 'event 1',
      description: 'desc 1',
      date: new Date(),
      city: 'cairo',
      capacity: 20,
      category: samplecategoryid,
      createdby: adminid,
    });

    const res = await request(app).get('/api/events');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('success');
  });

  test('GET /api/events - should filter events by city', async () => {
    await event.create([
      { title: 'cairo event', description: 'desc', date: new Date(), city: 'cairo', capacity: 10, category: samplecategoryid, createdby: adminid },
      { title: 'alex event', description: 'desc', date: new Date(), city: 'alexandria', capacity: 10, category: samplecategoryid, createdby: adminid },
    ]);

    const res = await request(app).get('/api/events?city=cairo');

    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].city).toBe('cairo');
  });
});