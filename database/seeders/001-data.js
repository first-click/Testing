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
    const data = generateData(50);
    const users = data.map((entry) => entry.user);

    const persons = data.map((entry) => entry.person);
    const positions = data.map((entry) => entry.position);
    const postings = data.map((entry) => entry.posting);
    const addresses = data.map((entry) => entry.address);

    const addresses_companies = data.map((entry) => entry.address_company);
    const addresses_persons = data.map((entry) => entry.address_person);
    const postings_users = data.map((entry) => entry.posting_user);
    const persons_positions = data.map((entry) => entry.person_position);

    const date = new Date();

    try {
      await queryInterface.bulkInsert('users', users, {});
      await queryInterface.bulkInsert('persons', persons, {});
      await queryInterface.bulkInsert('positions', positions, {});
      await queryInterface.bulkInsert('postings', postings, {});
      await queryInterface.bulkInsert('addresses', addresses, {});
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
        {
          role_id: 5,
          role_user: 'user',
          created_at: date,
          updated_at: date,
        },
        {
          role_id: 6,
          role_user: 'admin',
          created_at: date,
          updated_at: date,
        },
        {
          role_id: 7,
          role_user: 'publisher',
          created_at: date,
          updated_at: date,
        },
      ]);
      await queryInterface.bulkInsert(
        'addresses_companies',
        addresses_companies,
        {}
      );
      await queryInterface.bulkInsert(
        'addresses_persons',
        addresses_persons,
        {}
      );
      await queryInterface.bulkInsert(
        'persons_positions',
        persons_positions,
        {}
      );
      await queryInterface.bulkInsert(
        'roles_users',
        [
          {
            role_id: 1,
            user_id: 1,
            role_user: 'posting_creator',
            created_at: date,
            updated_at: date,
          },
          {
            role_id: 6,
            user_id: 1,
            role_user: 'admin',
            created_at: date,
            updated_at: date,
          },
          {
            role_id: 1,
            user_id: 2,
            role_user: 'posting_creator',
            created_at: date,
            updated_at: date,
          },
          {
            role_id: 6,
            user_id: 2,
            role_user: 'admin',
            created_at: date,
            updated_at: date,
          },
        ],
        {}
      );
      await queryInterface.bulkInsert('postings_users', postings_users, {});
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
    await queryInterface.bulkDelete('roles_users', null, {});
  },
};
