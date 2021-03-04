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
        'postings_persons',
        {
          posting_person_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
          },
          posting_id: {
            type: Sequelize.INTEGER,
            // primaryKey: true,
            references: {
              model: 'postings',
              key: 'posting_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          person_id: {
            type: Sequelize.INTEGER,
            // primaryKey: true,
            references: {
              model: 'persons',
              key: 'person_id',
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
      await queryInterface.dropTable('postings_persons', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
