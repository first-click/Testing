const request = require('supertest');
const app = require('../app');
const dotenv = require('dotenv');
const { sequelize } = require('../models');
const User = sequelize.models.user;
const { userOne, userTwo, setUpDatabase } = require('./fixtures/db');

// Load env vars
dotenv.config({ path: './config/config.env' });
let token;
let id;
beforeAll(setUpDatabase);

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: userTwo.email,
      password: userTwo.password,
    })
    .expect(200);
  token = response.body.token;
});

test('Should get all Users', async () => {
  const response = await request(app)
    .get('/api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(response.body[0].name).toBe('testit11');
  expect(response.body[1].name).toBe('testit12');
});

test('Should get a single User', async () => {
  const response = await request(app)
    .get('/api/v1/users/1')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(response.body.name).toBe('testit11');
});

//@desc Create new user
//@route POST /api/v1/users
test('Should create a new User', async () => {
  const response = await request(app)
    .post('/api/v1/users')
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'user3',
      email: 'user3@gmx.de',
      password: '123456',
      role: 'admin',
    })
    .expect(200);
  expect(response.body.name).toEqual('user3');
  id = response.body.id;
});

//@desc Update a user
//@route PUT /api/v1/users/:id
test('Should update a User', async () => {
  const response = await request(app)
    .put(`/api/v1/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      name: 'user4',
      email: 'user4@gmx.de',
      password: '123456',
    })
    .expect(200);
  expect(response.body[0]).toEqual(1);
});

//@desc Delete a user
//@route DELETE /api/v1/users/:id
test('Should delete a User', async () => {
  const response = await request(app)
    .delete(`/api/v1/users/${id}`)
    .set('Authorization', `Bearer ${token}`)
    .send()
    .expect(200);
  expect(response.body.success).toEqual(true);
});
