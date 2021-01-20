const request = require('supertest');
const crypto = require('crypto');
var redis = require('redis');
var JWTR = require('jwt-redis').default;
var redisClient = redis.createClient();
var jwtr = new JWTR(redisClient);

const app = require('../app');
const { sequelize } = require('../database/models');
const User = sequelize.models.user;
const dotenv = require('dotenv');
const { userOne, setUpDatabase } = require('./fixtures/db');
const sendMailMock = jest.fn().mockReturnValue('mock worked');
jest.mock('nodemailer');

const nodemailer = require('nodemailer');
nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

beforeEach(() => {
  sendMailMock.mockClear();
  nodemailer.createTransport.mockClear();
});

// Load env vars
dotenv.config({ path: './config/config.env' });
let token;
let resetT;

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
  const decoded = jwtr.decode(response.body.token, process.env.JWT_SECRET);

  const user = await User.findByPk(decoded.user_id);

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
  await request(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .send()
    .expect(200);

  const decoded = jwtr.decode(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.user_id);

  expect(user.name).toBe('testit11');
  expect(user.email).toBe('testit11@gmx.de');
});

// test update user
test('Should update user', async () => {
  await request(app)
    .put(`/api/v1/auth/updatedetails/${userOne.user_id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'jon10ee',
      email: 'jon10eetest@gmx.de',
    });

  const user = await User.findByPk(userOne.user_id);

  //Assertions about the user
  expect(user.name).toBe('jon10ee');
  expect(user.email).toBe('jon10eetest@gmx.de');
  expect(user.name).not.toBe('testit11');
  expect(user.email).not.toBe('testit11@gmx.de');
});

// test update password
test('Should update password', async () => {
  await request(app)
    .put(`/api/v1/auth/updatepassword/${userOne.user_id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      email: userOne.email,
      currentPassword: userOne.password,
      newPassword: '09876543',
    });

  const user = await User.findByPk(userOne.user_id);

  expect(user.password).not.toBe('09876543');
});

// test update password
// user kann sich mit altem password nicht einloggen
test('Should login existing user', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'jon10eetest@gmx.de',
      password: '123456',
    })
    .expect(401);
});

// test update password
// user can login with new password
test('Should login existing user', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'jon10eetest@gmx.de',
      password: '09876543',
    })
    .expect(200);
});

// test get reset token - forgot password
test('Should get resetToken - forgot password', async () => {
  const response = await request(app).post('/api/v1/auth/forgotpassword').send({
    email: 'testit12@gmx.de',
  });

  resetT = response.body.resetToken;

  expect(200);
  expect(sendMailMock).toHaveBeenCalled();
});

// test reset password - new password
test('Should reset password', async () => {
  await request(app).put(`/api/v1/auth/resetpassword/${resetT}`).send({
    password: '0987654',
  });

  expect(200);
});

// test reset password - login with new password
test('Should login existing user', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'testit12@gmx.de',
      password: '0987654',
    })
    .expect(200);
});

// test reset password with old password does not work
test('Should login existing user', async () => {
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'testit12@gmx.de',
      password: '123456',
    })
    .expect(401);
});

// test logout user
test('Should logout user', async () => {
  await request(app)
    .get('/api/v1/auth/logout')
    .set('Authorization', `Bearer ${token}`)
    .expect({
      success: true,
      data: {},
    });

  // After logout getting user data with same token should be impossible
  await request(app)
    .get('/api/v1/auth/me')
    .set('Authorization', `Bearer ${token}`)
    .send()
    .expect(401);
});

//test register user
test('Should register a new user', async () => {
  const response = await request(app).post('/api/v1/auth/register').send({
    name: 'testitson22',
    email: 'testitson22@gmx.de',
    password: '123456',
    role: 'user',
  });
  const decoded = jwtr.decode(response.body.token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.user_id);

  //Assertion about the token
  expect(response.body.token).not.toBe(null);

  //Assertions about the user
  expect(user.name).toBe('testitson22');
  expect(user.email).toBe('testitson22@gmx.de');
  expect(user.password).not.toBe('123456');
  expect(user.role).toBe('user');
});
