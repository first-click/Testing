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
        'postings',
        {
          posting_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },

          posting_startdate: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          posting_enddate: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          posting_description: {
            allowNull: false,
            type: Sequelize.STRING,
          },

          posting_qualifications: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          posting_working_hours: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          posting_contact_person: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          posting_contact_email: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          posting_contact_phonenumber: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          posting_salary: {
            allowNull: false,
            type: Sequelize.INTEGER,
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
      await queryInterface.dropTable('postings', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
