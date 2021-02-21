'use strict';
const { generateData } = require('./helpers/generateData');

// console.log(users);

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
    const data = generateData(10);
    const users = data.map((entry) => entry.user);
    const persons = data.map((entry) => entry.person);
    const positions = data.map((entry) => entry.position);
    const persons_positions = data.map((entry) => entry.person_position);
    let date = new Date();

    try {
      await queryInterface.bulkInsert('users', users, {});
      await queryInterface.bulkInsert('persons', persons, {});
      await queryInterface.bulkInsert('positions', positions, {});
      await queryInterface.bulkInsert(
        'persons_positions',
        persons_positions,
        {}
      );

      await queryInterface.bulkInsert(
        'employees',
        [
          {
            employee_id: 1,
            manager_id: null,
            employee_name: 'Amy',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 2,
            manager_id: 1,
            employee_name: 'Bob',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 3,
            manager_id: 1,
            employee_name: 'Nancy',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 4,
            manager_id: 1,
            employee_name: 'George',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 5,
            manager_id: 2,
            employee_name: 'Rachel',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 6,
            manager_id: 2,
            employee_name: 'Georgia',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 7,
            manager_id: 3,
            employee_name: 'Kevin',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 8,
            manager_id: 4,
            employee_name: 'Leonard',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 9,
            manager_id: 4,
            employee_name: 'William',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 10,
            manager_id: 5,
            employee_name: 'David',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 11,
            manager_id: 5,
            employee_name: 'Lydia',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 12,
            manager_id: 5,
            employee_name: 'Mary',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 13,
            manager_id: 6,
            employee_name: 'Lisa',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 14,
            manager_id: 6,
            employee_name: 'Scott',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 15,
            manager_id: 8,
            employee_name: 'Tim',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 16,
            manager_id: 9,
            employee_name: 'Dorothy',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 17,
            manager_id: 9,
            employee_name: 'Sarah',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 18,
            manager_id: 9,
            employee_name: 'Rebecca',
            created_at: date,
            updated_at: date,
          },
          {
            employee_id: 19,
            manager_id: 9,
            employee_name: 'Larry',
            created_at: date,
            updated_at: date,
          },
        ],
        {}
      );
    } catch (err) {
      console.log(err);
    }
  },
  /**
   * @typedef {import('sequelize').Sequelize} Sequelize
   * @typedef {import('sequelize').QueryInterface} QueryInterface
   */

  /**
   * @param {QueryInterface} queryInterface
   * @param {Sequelize} Sequelize
   * @returns
   */
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('persons', null, {});
    await queryInterface.bulkDelete('positions', null, {});
    await queryInterface.bulkDelete('persons_positions', null, {});
    await queryInterface.bulkDelete('employees', null, {});
  },
};
