const { sequelize } = require('../../database/models');
const User = sequelize.models.user;

const userOne = {
  user_id: 1,
  name: 'testit11',
  email: 'testit11@gmx.de',
  password: '123456',
  role: 'user',
};

const userTwo = {
  user_id: 2,
  name: 'testit12',
  email: 'testit12@gmx.de',
  password: '123456',
  role: 'admin',
};

const setUpDatabase = async () => {
  await User.destroy({ truncate: true, cascade: true });
  await User.create(userOne);
  await User.create(userTwo);
};

module.exports = {
  userOne,
  userTwo,
  setUpDatabase,
};
