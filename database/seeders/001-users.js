'use strict';
const bcrypt = require('bcryptjs');

const hashedPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

const faker = require('faker');
function createUser() {
  let firstName = faker.name.firstName();
  let lastName = faker.name.lastName();
  return {
    company_id: faker.helpers.randomize([1, 2, 3]),
    name: faker.internet.userName(firstName, lastName),
    email: faker.internet.email(firstName, lastName),
    password: hashedPassword('secret'),
    role: 'admin',
    created_at: new Date(),
    updated_at: new Date(),
  };
}

function createUsers(amount) {
  let users = [];
  for (let i = 0; i < amount; i++) {
    users.push(createUser());
  }
  return users;
}

const users = createUsers(10);
console.log(users);

module.exports = {
  /**
   * @typedef {import('sequelize').Sequelize} Sequelize
   * @typedef {import('sequelize').QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert(
        'users',
        users,
        // [
        //   createUser(),
        //   // {
        //   //   company_id: 1,
        //   //   name: 'JohnDoe187',
        //   //   email: 'johnD187@outlook.com',
        //   //   password: hashedPassword('secret'),
        //   //   role: 'admin',
        //   //   created_at: new Date(),
        //   //   updated_at: new Date(),
        //   // },
        // ],
        {}
      );
    } catch (err) {
      console.log(err);
    }
  },
  /**
   * @typedef {import('sequelize').Sequelize} Sequelize
   * @typedef {import('sequelize').QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  down: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('users', null, {});
  },
};
