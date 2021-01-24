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
    await queryInterface.createTable('persons_positions', {
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      person_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'persons',
          key: 'person_id',
        },
      },
      position_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'positions',
          key: 'position_id',
        },
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('persons_positions');
  },
};
