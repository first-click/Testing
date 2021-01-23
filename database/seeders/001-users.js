'use strict';
const bcrypt = require('bcryptjs');

const hashedPassword = (password) => {
  const salt = bcrypt.genSaltSync();
  return bcrypt.hashSync(password, salt);
};

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
    await queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'JohnDoe187',
          email: 'johnD187@outlook.com',
          password: hashedPassword('secret'),
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
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
