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
    await queryInterface.renameColumn('users', 'username', 'name');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'name', 'username');
  },
};
