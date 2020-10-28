const request = require('supertest');
const app = require('../app');
const dotenv = require('dotenv');
const { sequelize } = require('../models');
const User = sequelize.models.user;
const { userOne, userTwo, setUpDatabase } = require('./fixtures/db');

// Load env vars
dotenv.config({ path: './config/config.env' });
let token;
beforeAll(setUpDatabase);

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: userTwo.email,
      password: userTwo.password,
    })
    .expect(200);

  token = JSON.parse(response.text);
});

test('Should create User', async () => {
  const response = await request(app)
    .post('/api/v1/users')
    .set('Authorization', `Bearer ${token.token}`)
    .send({
      username: 'user1',
      email: 'user1@gmx.de',
      password: '123456',
      role: 'user',
    })
    .expect(200);
  console.log(response.body);
});
