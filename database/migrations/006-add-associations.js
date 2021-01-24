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
    await queryInterface.addColumn(
      'users', // name of Source model
      'company_id', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies', // name of Target model
          key: 'company_id', // key in Target model that we're referencing
        },
      }
    );
    await queryInterface.addColumn(
      'persons', // name of Source model
      'user_id', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        unique: true, // Foreign Key muss auch unique sein
        references: {
          model: 'users', // name of Target model
          key: 'user_id', // key in Target model that we're referencing
        },
      }
    );
    await queryInterface.addColumn(
      'persons', // name of Source model
      'company_id', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'companies', // name of Target model
          key: 'company_id', // key in Target model that we're referencing
        },
      }
    );
    await queryInterface.addColumn(
      'positions', // name of Source model
      'company_id', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        unique: true, // Foreign Key muss auch unique sein
        references: {
          model: 'companies', // name of Target model
          key: 'company_id', // key in Target model that we're referencing
        },
      }
    );
    await queryInterface.addColumn(
      'computers', // name of Source model
      'person_id', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'persons', // name of Target model
          key: 'person_id', // key in Target model that we're referencing
        },
      }
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'company_id');
    await queryInterface.removeColumn('persons', 'user_id');
    await queryInterface.removeColumn('persons', 'company_id');
    await queryInterface.removeColumn('positions', 'company_id');
    await queryInterface.removeColumn('computers', 'person_id');
  },
};
