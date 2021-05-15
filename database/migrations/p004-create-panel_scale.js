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
        'panel_scales',
        {
          panel_scale_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          scale_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'scales',
              key: 'scale_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          company_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'companies',
              key: 'company_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },
          panel_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'panels',
              key: 'panel_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
          },
          base: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          length: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          fields: {
            type: Sequelize.ARRAY(Sequelize.INTEGER),
            allowNull: false,
          },
          anchors: {
            type: Sequelize.ARRAY(Sequelize.STRING),
          },
          rank: {
            type: Sequelize.STRING,
            allowNull: false,
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
      await queryInterface.dropTable('panel_scales', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
