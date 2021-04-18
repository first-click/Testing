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
        'scales',
        {
          scale_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'companies',
              key: 'company_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
            allowNull: false,
          },
          creator_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'user_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          editor_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'users',
              key: 'user_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
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
          // scale: {
          //   type: Sequelize.STRING,
          //   allowNull: false,
          // },
          // type: {
          //   type: Sequelize.STRING,
          //   allowNull: false,
          // },
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
      await queryInterface.dropTable('scales', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
