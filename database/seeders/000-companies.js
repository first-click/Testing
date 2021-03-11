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
      'companies',
      [
        {
          company_name: 'Megacorp',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          company_name: 'Astro Dynamics',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          company_name: 'Realtekk',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          company_name: 'No Company',
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
    await queryInterface.bulkDelete('companies', null, {});
  },
};
