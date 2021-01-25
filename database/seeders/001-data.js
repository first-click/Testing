'use strict';
const { generateData } = require('./helpers/generateData');
// const bcrypt = require('bcryptjs');

// const hashedPassword = (password) => {
//   const salt = bcrypt.genSaltSync();
//   return bcrypt.hashSync(password, salt);
// };

// const faker = require('faker');
// function createUser() {
//   let firstName = faker.name.firstName();
//   let lastName = faker.name.lastName();
//   return {
//     company_id: faker.helpers.randomize([1, 2, 3]),
//     name: faker.internet.userName(firstName, lastName),
//     email: faker.internet.email(firstName, lastName),
//     password: hashedPassword('secret'),
//     role: 'admin',
//     created_at: new Date(),
//     updated_at: new Date(),
//   };
// }

// function createUsers(amount) {
//   let users = [];
//   for (let i = 0; i < amount; i++) {
//     users.push(createUser());
//   }
//   return users;
// }

// const users = createUsers(10);
const data = generateData(50);
const users = data.map((entry) => entry.user);
const persons = data.map((entry) => entry.person);
const positions = data.map((entry) => entry.position);
const persons_positions = data.map((entry) => entry.person_position);

// console.log(users);

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
      await queryInterface.bulkInsert('users', users, {});
      await queryInterface.bulkInsert('persons', persons, {});
      await queryInterface.bulkInsert('positions', positions, {});
      await queryInterface.bulkInsert(
        'persons_positions',
        persons_positions,
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
    await queryInterface.bulkDelete('persons', null, {});
    await queryInterface.bulkDelete('positions', null, {});
    await queryInterface.bulkDelete('persons_positions', null, {});
  },
};
