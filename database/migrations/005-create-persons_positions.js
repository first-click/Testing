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
        'persons_positions',
        {
          person_position_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
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
          position_id: {
            type: Sequelize.INTEGER,
            // primaryKey: true,
            references: {
              model: 'positions',
              key: 'position_id',
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
          junk: Sequelize.CHAR(1000),
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
      await queryInterface.dropTable('persons_positions', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
