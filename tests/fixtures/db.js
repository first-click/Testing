//"test": "jest --watch --coverage --runInBand --detectOpenHandles"

const { sequelize } = require('../../models');
const User = sequelize.models.user;

const userOne = {
  id: 1,
  username: 'testit11',
  email: 'testit11@gmx.de',
  password: '123456',
  role: 'user',
};

const userTwo = {
  id: 2,
  username: 'testit12',
  email: 'testit12@gmx.de',
  password: '123456',
  role: 'admin',
};

const setUpDatabase = async () => {
  await User.destroy({ truncate: true });
  await User.create(userOne);
  await User.create(userTwo);
};

module.exports = {
  userOne,
  userTwo,
  setUpDatabase,
};