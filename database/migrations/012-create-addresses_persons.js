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
        'addresses_persons',
        {
          address_person_id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER,
          },
          address_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'addresses',
              key: 'address_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },

          person_id: {
            type: Sequelize.INTEGER,
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
      await queryInterface.dropTable('addresses_persons', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
