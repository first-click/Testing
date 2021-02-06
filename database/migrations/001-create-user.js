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
        'users',
        {
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          name: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: {
              len: {
                args: [1, 20],
                msg: 'please use the right length',
              },
            },
          },
          email: {
            type: Sequelize.STRING,
            unique: true,
            allowNull: false,
            validate: { isEmail: true },
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          role: {
            type: Sequelize.STRING,
            validate: {
              isIn: [['user', 'admin', 'publisher']],
            },
            defaultValue: 'user',
          },
          reset_password_token: Sequelize.STRING,
          reset_password_expire: Sequelize.DATE,
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
      await queryInterface.dropTable('users', { transaction });
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};
