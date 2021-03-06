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
        'addresses_companies',
        {
          address_company_id: {
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            type: Sequelize.INTEGER,
          },
          address_id: {
            // primaryKey: true,
            type: Sequelize.INTEGER,

            references: {
              model: 'addresses',
              key: 'address_id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
          },

          company_id: {
            //primaryKey: true,
            type: Sequelize.INTEGER,

            references: {
              model: 'companies',
              key: 'company_id',
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
      await queryInterface.dropTable('addresses_companies', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
