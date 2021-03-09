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

    const persons = data.map((entry) => entry.person);
    const positions = data.map((entry) => entry.position);
    const postings = data.map((entry) => entry.posting);

    const postings_users = data.map((entry) => entry.posting_user);
    const persons_positions = data.map((entry) => entry.person_position);

    const date = new Date();

    try {
      await queryInterface.bulkInsert('users', users, {});
      await queryInterface.bulkInsert('persons', persons, {});
      await queryInterface.bulkInsert('positions', positions, {});
      await queryInterface.bulkInsert('postings', postings, {});
      await queryInterface.bulkInsert('roles', [
        {
          role_id: 1,
          role_user: 'posting_creator',
          created_at: date,
          updated_at: date,
        },
        {
          role_id: 2,
          role_user: 'posting_editor',
          created_at: date,
          updated_at: date,
        },
        {
          role_id: 3,
          role_user: 'posting_reader',
          created_at: date,
          updated_at: date,
        },
        {
          role_id: 4,
          role_user: 'posting_applicant',
          created_at: date,
          updated_at: date,
        },
      ]);
      await queryInterface.bulkInsert(
        'persons_positions',
        persons_positions,
        {}
      );
      await queryInterface.bulkInsert('postings_users', postings_users, {});
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
    await queryInterface.bulkDelete('persons', null, {});
    await queryInterface.bulkDelete('positions', null, {});
    await queryInterface.bulkDelete('postings', null, {});
    await queryInterface.bulkDelete('roles', null, {});
    await queryInterface.bulkDelete('persons_positions', null, {});
    await queryInterface.bulkDelete('postings_users', null, {});
  },
};
