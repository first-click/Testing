const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const User = sequelize.models.user;
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });

const userOne = {
  username: 'testit10',
  email: 'testit10@gmx.de',
  password: '123456',
  role: 'user',
};

beforeEach(async () => {
  await User.destroy({ truncate: true });
  await User.create(userOne);
});

test('Should register a new user', async () => {
  await request(app)
    .post('/api/v1/auth/register')
    .send({
      username: 'testitson21',
      email: 'testitson21@gmx.de',
      password: '123456',
      role: 'user',
    })
    .expect(200);
});

// test('Should login existing user', async () => {
//   await request(app)
//     .post('/api/v1/auth/login')
//     .send({
//       email: userOne.email,
//       password: userOne.password,
//     })
//     .expect(200);
// });
