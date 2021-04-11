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
    const data = generateData(100);
    const users = data.map((entry) => entry.user);

    const persons = data.map((entry) => entry.person);
    const positions = data.map((entry) => entry.position);
    const postings = data.map((entry) => entry.posting);
    const addresses = data.map((entry) => entry.address);
    const benefits = data.map((entry) => entry.benefit);
    const qualifications = data.map((entry) => entry.qualification);
    const posting_benefits = data.map((entry) => entry.posting_benefit);
    const posting_qualifications = data.map(
      (entry) => entry.posting_qualification
    );

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
      await queryInterface.bulkInsert('benefits', benefits, {});
      await queryInterface.bulkInsert('posting_benefits', posting_benefits, {});
      await queryInterface.bulkInsert('qualifications', qualifications, {});
      await queryInterface.bulkInsert(
        'posting_qualifications',
        posting_qualifications,
        {}
      );

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
      await queryInterface.bulkInsert('posting_users', postings_users, {});
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
    await queryInterface.bulkDelete('addresses', null, {});
    await queryInterface.bulkDelete('benefits', null, {});
    await queryInterface.bulkDelete('posting_benefits', null, {});
    await queryInterface.bulkDelete('qualifications', null, {});
    await queryInterface.bulkDelete('posting_qualifications', null, {});
    await queryInterface.bulkDelete('persons_positions', null, {});
    await queryInterface.bulkDelete('posting_users', null, {});
    await queryInterface.bulkDelete('addresses_persons', null, {});
    await queryInterface.bulkDelete('addresses_companies', null, {});
    await queryInterface.bulkDelete('roles_users', null, {});
  },
};
