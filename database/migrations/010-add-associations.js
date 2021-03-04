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
      await queryInterface.addColumn(
        'persons', // name of Source model
        'user_id', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'users', // name of Target model
            key: 'user_id', // key in Target model that we're referencing
          },
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'persons', // name of Source model
        'company_id', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'companies', // name of Target model
            key: 'company_id', // key in Target model that we're referencing
          },
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'positions', // name of Source model
        'company_id', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'companies', // name of Target model
            key: 'company_id', // key in Target model that we're referencing
          },
        },
        { transaction }
      );

      await queryInterface.addColumn(
        'postings', // name of Source model
        'company_id', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'companies', // name of Target model
            key: 'company_id', // key in Target model that we're referencing
          },
        },
        { transaction }
      );
      await queryInterface.addColumn(
        'postings', // name of Source model
        'position_id', // name of the key we're adding
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'positions', // name of Target model
            key: 'position_id', // key in Target model that we're referencing
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
      await queryInterface.removeColumn('persons', 'user_id', { transaction });
      await queryInterface.removeColumn('persons', 'company_id', {
        transaction,
      });
      await queryInterface.removeColumn('positions', 'company_id', {
        transaction,
      });
      await queryInterface.removeColumn('positions', 'posting_id', {
        transaction,
      });
      await queryInterface.removeColumn('postings', 'company_id', {
        transaction,
      });
      await queryInterface.removeColumn('postings', 'position_id', {
        transaction,
      });

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
