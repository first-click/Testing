const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Employee = sequelize.models.employee;

//@desc Get all positions
//@route GET /api/v1/employees
//@access Private/Admin erstmal nicht privat
// exports.getEmployees = asyncHandler(async (req, res) => {
//   const employees = await Employee.findAll({
//     cte: [
//       {
//         name: 'a',
//         model: Employee,
//         initial: {
//           where: { employee_id: 19 },
//         },
//         recursive: {
//           find: 'manager_id',
//         },
//       },
//     ],
//     cteSelect: 'a',
//   });

//   res.status(200).json({
//     success: true,
//     data: employees,
//   });
// });

// exports.getEmployees = asyncHandler(async (req, res) => {
//   const result = await Employee.findAll({
//     where: {
//       manager_id: null,
//     },
//     include: [
//       {
//         model: Employee,
//         as: 'children',
//       },
//     ],
//   });
//   res.send(result);
// });

//@desc Get all positions
//@route GET /api/v1/employees
//@access Private/Admin erstmal nicht privat
// exports.getEmployees = asyncHandler(async (req, res) => {
//   const employees = await sequelize.query(`WITH RECURSIVE
//   cte(employee_id, manager_id) AS (
//       SELECT employee_id, manager_id FROM employees
//        WHERE 19 = employees.employee_id
//        UNION
//        SELECT employees.employee_id, employees.manager_id FROM employees, cte
//        WHERE employees.employee_id = cte.manager_id
//   )
//   SELECT employees.name FROM employees, cte
//   WHERE cte.employee_id = employees.employee_id;`);
//   res.status(200).json({
//     success: true,
//     data: employees,
//   });
// });

//@desc Get all positions
//@route GET /api/v1/employees
//@access Private/Admin erstmal nicht privat
exports.getEmployees = asyncHandler(async (req, res) => {
  const employees = await sequelize.query(`
  WITH RECURSIVE
      cte(employee_id, manager_id, level) AS (
          SELECT employee_id, manager_id, 1 FROM employees
           WHERE 1 = employees.employee_id
           UNION
           SELECT employees.employee_id, employees.manager_id, cte.level+1 FROM employees, cte
           WHERE employees.manager_id = cte.employee_id AND cte.level+1 <= 3
      )
      SELECT employees.name FROM employees, cte
      WHERE employees.employee_id = cte.employee_id AND cte.level = 3;`);
  res.status(200).json({
    success: true,
    data: employees[0],
  });
});
