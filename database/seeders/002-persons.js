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
      'persons',
      [
        {
          company_id: 1,
          user_id: 1,
          person_first_name: 'Julian',
          person_last_name: 'Leweling',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('persons', null, {});
  },
};