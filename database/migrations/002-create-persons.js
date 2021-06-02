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
        'persons',
        {
          person_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          person_first_name: Sequelize.STRING,
          person_surname: Sequelize.STRING,

          person_email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: { isEmail: true },
          },

          person_phonenumber: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
          },
          person_applicant_message_hiring_manager: {
            type: Sequelize.STRING,
          },
          person_linkedin: {
            type: Sequelize.STRING,
            unique: true,
          },
          person_xing: {
            type: Sequelize.STRING,
            unique: true,
          },
          person_applicant_data_protection: {
            type: Sequelize.BOOLEAN,
          },

          created_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          // junk: Sequelize.CHAR(1000),
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
      await queryInterface.dropTable('persons', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
