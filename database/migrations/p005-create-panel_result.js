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
        'panel_results',
        {
          panel_result_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          panel_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'panels',
              key: 'panel_id',
            },
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          interviewer_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'user_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          applicant_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'user_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          panel_scale_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'panel_scales',
              key: 'panel_scale_id',
            },
            allowNull: false,
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
          },
          scale: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          value_number: {
            type: Sequelize.STRING,
          },
          value_string: {
            type: Sequelize.STRING,
          },
          comment: {
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
      await queryInterface.dropTable('panel_results', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
