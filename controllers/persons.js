const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Person = sequelize.models.person;
const Role = sequelize.models.role;
const Role_person = sequelize.models.role_person;

//@desc Get all persons
//@route GET /api/v1/persons
//@access Private/Admin
exports.getPersons = asyncHandler(async (req, res) => {
  const persons = await Person.findAll({});
  res.status(200).json({
    success: true,
    data: persons,
  });
});

//@desc Get single person
//@route GET /api/v1/persons/:person_id
//@access Private/Admin
exports.getPerson = asyncHandler(async (req, res) => {
  const person = await Person.findByPk(req.params.person_id);

  res.status(200).json({
    success: true,
    data: person,
  });
});

//@desc Create new person
//@route POST /api/v1/persons
//@access Private/Admin
exports.createPerson = asyncHandler(async (req, res) => {
  // Insert into table
  const { person_first_name, person_last_name, role_pers } = req.body;
  const person = await Person.create({
    person_first_name,
    person_last_name,
  });

  const role = await Role.findAll({
    where: { role_pers },
  });

  await Role_person.create({
    role_id: role[0].dataValues.role_id,
    person_id: person.person_id,
    role_pers: role_pers,
  });

  res.status(200).json({
    success: true,
    data: person,
  });
});

//@desc Update a person
//@route PUT /api/v1/persons/:person_id
//@access Private/Admin
exports.updatePerson = asyncHandler(async (req, res) => {
  const { person_first_name, person_last_name } = req.body;
  // update a person
  const person = await Person.update(
    {
      person_first_name: person_first_name,
      person_last_name: person_last_name,
    },
    { where: { person_id: req.params.person_id }, returning: true, plain: true }
  );
  res.status(200).json({
    success: true,
    data: person[1],
  });
});

//@desc Delete a person
//@route DELETE /api/v1/persons/:person_id
//@access Private/Admin
exports.deletePerson = asyncHandler(async (req, res) => {
  // Delete person
  const person = await Person.destroy({
    where: { person_id: req.params.person_id },
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});
