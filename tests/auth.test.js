const request = require('supertest');
const app = require('../app');
const { sequelize } = require('../models');
const User = sequelize.models.user;
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: './config/config.env' });
let token;
// wie bekomme ich eine einmalige id hin bei mongoose new mongoose.Types.ObjectId()
//brauche ich die überhaupt?
const userOneId = Math.floor(Math.random() * 10);
const userOne = {
  id: 1,
  username: 'testit11',
  email: 'testit11@gmx.de',
  password: '123456',
  role: 'user',
};

beforeEach(async () => {
  await User.destroy({ truncate: true });
  await User.create(userOne);
});

test('Should login existing user', async () => {
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: userOne.email,
      password: userOne.password,
    })
    .expect(200);
  console.log(response.body);

  token = JSON.parse(response.text);
  //console.log(token.token);
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
  console.log(token.token);
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
});
