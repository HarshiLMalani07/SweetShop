const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/User');
const Sweet = require('../src/models/Sweet');

let adminToken;
let userToken;

beforeAll(async () => {
  await mongoose.connect('mongodb://127.0.0.1:27017/sweetshop_test');
  
  // Create Admin & User for testing
  const adminRes = await request(app).post('/api/auth/register').send({
    username: 'admin', password: '123', role: 'admin'
  });
  adminToken = adminRes.body.token;

  const userRes = await request(app).post('/api/auth/register').send({
    username: 'user', password: '123', role: 'user'
  });
  userToken = userRes.body.token;
});

afterEach(async () => {
  await Sweet.deleteMany();
});

afterAll(async () => {
  await User.deleteMany();
  await mongoose.connection.close();
});

describe('Sweets API', () => {
  it('should allow ADMIN to add a sweet', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Test Candy', price: 1.0, category: 'Test', quantity: 10 });
    expect(res.statusCode).toEqual(201);
    expect(res.body.name).toBe('Test Candy');
  });

  it('should BLOCK normal users from adding sweets', async () => {
    const res = await request(app)
      .post('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ name: 'Hacker Candy', price: 0, category: 'Bad', quantity: 100 });
    expect(res.statusCode).toEqual(403); // Forbidden
  });

  it('should decrease quantity when purchased', async () => {
    // 1. Create a sweet (as admin)
    const sweet = await Sweet.create({ name: 'BuyMe', price: 2, category: 'Cake', quantity: 5 });

    // 2. Buy it (as user)
    const res = await request(app)
      .post(`/api/sweets/${sweet._id}/purchase`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ qty: 1 });

    expect(res.statusCode).toEqual(200);
    
    // 3. Verify stock dropped to 4
    const updated = await Sweet.findById(sweet._id);
    expect(updated.quantity).toBe(4);
  });
});
