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
      'profiles', // name of Source model
      'user_id', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
    await queryInterface.addColumn(
      'computers', // name of Source model
      'user_id', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // name of Target model
          key: 'id', // key in Target model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      }
    );
    await queryInterface.createTable('users_departments', {
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      department_id: {
        primaryKey: true,
        type: Sequelize.INTEGER,
        references: {
          model: 'departments',
          key: 'department_id',
        },
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('profiles', 'user_id');
    await queryInterface.removeColumn('computers', 'user_id');
    await queryInterface.dropTable('users_departments');
  },
};
