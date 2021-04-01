'use strict';

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
      'roles',
      [
        {
          role_id: 1,
          role_user: 'posting_creator',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: 2,
          role_user: 'posting_editor',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: 3,
          role_user: 'posting_reader',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: 4,
          role_user: 'posting_applicant',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: 5,
          role_user: 'user',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: 6,
          role_user: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_id: 7,
          role_user: 'publisher',
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
    await queryInterface.bulkDelete('roles', null, {});
  },
};
