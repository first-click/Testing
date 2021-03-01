const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Person = sequelize.models.person;

exports.getPersons = asyncHandler(async (req, res) => {
  const persons = await Person.findAll({
    raw: true,
  });

  const tree = (items, person_id = null, link = 'manager_id') =>
    items
      .filter((item) => item[link] === person_id)
      .map((item) => ({ ...item, children: tree(items, item.person_id) }));

  const results = tree(persons);

  res.status(200).json({
    success: true,
    data: results,
  });
});

// exports.getPersons = asyncHandler(async (req, res) => {
//   const persons = await Person.findAll({
//     where: {
//       manager_id: 1,
//     },
//     include: [
//       {
//         model: Person,
//         as: 'children',
//       },
//     ],
//   });

//   res.status(200).json({
//     success: true,
//     data: persons,
//   });
// });
