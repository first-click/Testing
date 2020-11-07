const request = require('supertest');
//const jwt = require('jsonwebtoken');
var redis = require('redis');
var JWTR = require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);

const app = require('../app');
const { sequelize } = require('../models');
const User = sequelize.models.user;
const dotenv = require('dotenv');
const { userOne, setUpDatabase } = require('./fixtures/db');

// Load env vars
dotenv.config({ path: './config/config.env' });
let token;

beforeAll(setUpDatabase);

//test login user

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  const decoded = jwtr.verify(response.body.token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);

  expect(user.email).toBe('testit11@gmx.de');
  expect(user.password).not.toBe('123456');

  token = response.body.token;

  //Assertion about the token
  expect(response.body.token).not.toBe(null);
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
    .set('Authorization', `Bearer ${token}`)
    .send()
    .expect(200);

  const decoded = jwtr.verify(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);

  expect(user.username).toBe('testit11');
  expect(user.email).toBe('testit11@gmx.de');
});

// test logout user

// ich kann nichts mehr machen, weil ich ausgeloggt bin

test('Should logout user', async () => {
  await request(app)
    .get('/api/v1/auth/logout')
    .set('Authorization', `Bearer ${token}`)
    .expect({
      success: true,
      data: '',
    });
  token = '';
  expect(token).toBe('');
});

//test register user

test('Should register a new user', async () => {
  const response = await request(app).post('/api/v1/auth/register').send({
    username: 'testitson22',
    email: 'testitson22@gmx.de',
    password: '123456',
    role: 'user',
  });

  const decoded = jwtr.verify(response.body.token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);

  //Assertion about the token
  expect(response.body.token).not.toBe(null);

  //Assertions about the user
  expect(user.username).toBe('testitson22');
  expect(user.email).toBe('testitson22@gmx.de');
  expect(user.password).not.toBe('123456');
  expect(user.role).toBe('user');
});
