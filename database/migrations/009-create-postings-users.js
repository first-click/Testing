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
        'postings_users',
        {
          posting_user_id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER,
          },

          posting_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'postings',
              key: 'posting_id',
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
      await queryInterface.dropTable('postings_users', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
