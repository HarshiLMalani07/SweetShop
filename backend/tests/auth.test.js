const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');

// Connect to a TEST database, not the real one
beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/sweetshop_test');
});

// Clean up data after every test
afterEach(async () => {
  await User.deleteMany();
});

// Close connection when done
afterAll(async () => {
  await mongoose.connection.close();
});

describe('Auth Endpoints', () => {
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        password: 'password123',
        role: 'user'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should login an existing user', async () => {
    // 1. Register first
    await request(app).post('/api/auth/register').send({
      username: 'loginuser',
      password: 'pass123'
    });

    // 2. Try Login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'loginuser',
        password: 'pass123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('should reject wrong passwords', async () => {
    await request(app).post('/api/auth/register').send({
      username: 'wrongpass',
      password: 'correct'
    });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'wrongpass',
        password: 'WRONG'
      });
    expect(res.statusCode).toEqual(401);
  });
});