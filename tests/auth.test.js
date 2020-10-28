const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const { sequelize } = require('../models');
const User = sequelize.models.user;
const dotenv = require('dotenv');
const { userOne, setUpDatabase } = require('./fixtures/db');

// Load env vars
dotenv.config({ path: './config/config.env' });
let token;

beforeAll(setUpDatabase);

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);

  token = JSON.parse(response.text);
});

test('Should not login with bad credentials', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: userOne.email,
      password: 'wrongemail',
    })
    .expect(401);
});

test('Should get current logged in user ', async () => {
  // console.log(token.token);
  await request(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${token.token}`)
    .send()
    .expect(200);
});

test('Should register a new user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/register')
    .send({
      username: 'testitson22',
      email: 'testitson22@gmx.de',
      password: '123456',
      role: 'user',
    })
    .expect(200);
  //Assert that the database was change correctly
  const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);
  expect(user).not.toBeNull();

  //Assertions about the response
  expect(user.username).toBe('testitson22');
  expect(user.password).not.toBe('123456');
});
