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
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        'roles_users',
        {
          role_user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          role_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'roles',
              key: 'role_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          user_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'user_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          role_user: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction }
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.dropTable('roles_users', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
