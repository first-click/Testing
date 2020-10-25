const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const User = sequelize.models.user;

const userOne = {
  username: 'testit6',
  email: 'testit6@gmx.de',
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
      username: 'testitson4',
      email: 'testitson4@gmx.de',
      password: '123456',
      role: 'user',
    })
    .expect({ success: true, token: !null });
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
