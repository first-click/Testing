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
  const decoded = jwtr.decode(response.body.token, process.env.JWT_SECRET);

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

  const decoded = jwtr.decode(token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);

  expect(user.username).toBe('testit11');
  expect(user.email).toBe('testit11@gmx.de');
});

// test update user
// nur der user, der richtig eingeloggt ist, kann updaten
// update auf Richtigkeit überprüfen
test('Should update user', async () => {
  const response = await request(app)
    .put(`/api/v1/auth/updatedetails/${userOne.id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      username: 'jon10ee',
      email: 'jon10eetest@gmx.de',
    });

  const user = await User.findByPk(userOne.id);
  console.log(user);

  //Assertions about the user
  expect(user.username).toBe('jon10ee');
  expect(user.email).toBe('jon10eetest@gmx.de');
});

// test logout user
// diesen test mit Julian durchsprechen, wenn logout steht

// ich kann nichts mehr machen, weil ich ausgeloggt bin

// test('Should logout user', async () => {
//   await request(app)
//     .get('/api/v1/auth/logout')
//     .set('Authorization', `Bearer ${token}`)
//     .expect({
//       success: true,
//       data: '',
//     });
//   token = '';
//   expect(token).toBe('');
// });

//test register user

test('Should register a new user', async () => {
  const response = await request(app).post('/api/v1/auth/register').send({
    username: 'testitson22',
    email: 'testitson22@gmx.de',
    password: '123456',
    role: 'user',
  });

  const decoded = jwtr.decode(response.body.token, process.env.JWT_SECRET);
  const user = await User.findByPk(decoded.id);

  //Assertion about the token
  expect(response.body.token).not.toBe(null);

  //Assertions about the user
  expect(user.username).toBe('testitson22');
  expect(user.email).toBe('testitson22@gmx.de');
  expect(user.password).not.toBe('123456');
  expect(user.role).toBe('user');
});

//@desc Update password
//@route PUT /api/v1/auth/updatepassword/:id
//@access Private

// test
// user kann sich mit neuem password einloggen
// user kann sich nicht mit dem alten password einloggen

//@desc Forgot password
//@route Post /api/v1/auth/forgotpassword
//@access Public

// test
// hat user resetToken bekommen
// hat user neues password eingegeben und funktioniert es

//@desc Reset password
//@route PUT /api/v1/auth/resetpassword/:resettoken
//@access Public

// test
// funktioniert das neue Passwort
// geht das alte Passwort nicht mehr
