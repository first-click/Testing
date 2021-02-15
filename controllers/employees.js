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
//       manager_id: 1,
//     },
//     include: [
//       {
//         model: Employee,
//         as: 'children',
//       },
//     ],
//   });

//   let test = Object.assign({}, result);

//   //Object.assign({}, result)
//   res.send(result);
// });

//@desc Get all positions
//@route GET /api/v1/employees
//@access Private/Admin erstmal nicht privat
exports.getEmployees = asyncHandler(async (req, res) => {
  const employees = await sequelize.query(`With RECURSIVE 
  EmployeeCTE (employee_id, name, manager_id, level)
  as
  (
  Select employee_id, name, manager_id, 1
    from employees
    where manager_id is null
    
    union all
    Select employees.employee_id, employees.name,
    employees.manager_id, EmployeeCTE.level + 1
    from employees
    join EmployeeCTE
    on employees.manager_id = EmployeeCTE.employee_id
    
  )
  Select EmpCTE.name as Employee,COALESCE(MgrCTE.name,'super boss')  as Manager,
  EmpCTE.level
  from EmployeeCTE EmpCTE
  left join EmployeeCTE MgrCTE
  on EmpCTE.manager_id = MgrCTE.employee_id
  `);
  res.status(200).json({
    success: true,
    data: employees,
  });
});

//@desc Get all positions
//@route GET /api/v1/employees
//@access Private/Admin erstmal nicht privat
// exports.getEmployees = asyncHandler(async (req, res) => {
//   const employees = await sequelize.query(`
//   WITH RECURSIVE
//       cte(employee_id, manager_id, level) AS (
//           SELECT employee_id, manager_id, 1 FROM employees
//            WHERE 1 = employees.employee_id
//            UNION
//            SELECT employees.employee_id, employees.manager_id, cte.level+1 FROM employees, cte
//            WHERE employees.manager_id = cte.employee_id AND cte.level+1 <= 3
//       )
//       SELECT employees.name FROM employees, cte
//       WHERE employees.employee_id = cte.employee_id AND cte.level = 3;`);
//   res.status(200).json({
//     success: true,
//     data: employees[0],
//   });
// });
