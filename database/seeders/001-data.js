'use strict';
const { generateData } = require('./helpers/generateData');

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
    const data = generateData(10);
    const users = data.map((entry) => entry.user);
    const companies = data.map((entry) => entry.company);
    const persons = data.map((entry) => entry.person);
    const postings = data.map((entry) => entry.posting);
    const positions = data.map((entry) => entry.position);
    // const roles = data.map((entry) => entry.role);
    const postings_persons = data.map((entry) => entry.posting_person);
    const persons_positions = data.map((entry) => entry.person_position);
    // const roles_persons = data.map((entry) => entry.roles_persons);

    try {
      await queryInterface.bulkInsert('users', users, {});
      await queryInterface.bulkInsert('companies', companies, {});
      await queryInterface.bulkInsert('persons', persons, {});
      await queryInterface.bulkInsert('postings', postings, {});
      await queryInterface.bulkInsert('positions', positions, {});
      // await queryInterface.bulkInsert('roles', roles, {});
      await queryInterface.bulkInsert(
        'persons_positions',
        persons_positions,
        {}
      );
      await queryInterface.bulkInsert('postings_persons', postings_persons, {});
      // await queryInterface.bulkInsert('roles_persons', roles_persons, {});
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
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('companies', null, {});
    await queryInterface.bulkDelete('persons', null, {});
    await queryInterface.bulkDelete('postings', null, {});
    await queryInterface.bulkDelete('positions', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('persons_positions', null, {});
    await queryInterface.bulkDelete('postings_persons', null, {});
    await queryInterface.bulkDelete('roles_persons', null, {});
  },
};
