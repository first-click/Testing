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

exports.getEmployees = asyncHandler(async (req, res) => {
  const result = await Employee.findAll({
    where: {
      manager_id: null,
    },
    include: [
      {
        model: Employee,
        as: 'children',
      },
    ],
  });
  res.send(result);
});
