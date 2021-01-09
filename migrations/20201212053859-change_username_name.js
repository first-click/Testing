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
    await queryInterface.renameColumn(
      'users',
      'resetPasswordToken',
      'reset_password_token'
    );
    await queryInterface.renameColumn(
      'users',
      'resetPasswordExpire',
      'reset_password_expire'
    );
    // await queryInterface.renameColumn('users', 'createdAt', 'created_at');
    // await queryInterface.renameColumn('users', 'updatedAt', 'updated_at');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('users', 'name', 'username');
    await queryInterface.renameColumn(
      'users',
      'reset_password_token',
      'resetPasswordToken'
    );
    await queryInterface.renameColumn(
      'users',
      'reset_password_expire',
      'resetPasswordExpire'
    );
    // await queryInterface.renameColumn('users', 'created_at', 'createdAt');
    // await queryInterface.renameColumn('users', 'updated_at', 'updatedAt');
  },
};
