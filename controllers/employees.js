const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Employee = sequelize.models.employee;

exports.getEmployees = asyncHandler(async (req, res) => {
  const employees = await Employee.findAll({
    raw: true,
  });

  const tree = (items, employee_id = null, link = 'manager_id') =>
    items
      .filter((item) => item[link] === employee_id)
      .map((item) => ({ ...item, children: tree(items, item.employee_id) }));

  const results = tree(employees);

  res.status(200).json({
    success: true,
    data: results,
  });
});

// exports.getEmployees = asyncHandler(async (req, res) => {
//   const employees = await Employee.findAll({
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

//   res.status(200).json({
//     success: true,
//     data: employees,
//   });
// });
