const { sequelize, Sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Person = sequelize.models.person;
const Position = sequelize.models.position;
const User = sequelize.models.user;

//@desc Get all persons
//@route GET /api/v1/persons
//@access Private/Admin
exports.getPersons = asyncHandler(async (req, res, next) => {
  const persons = await Person.findAll({});

  if (!persons) {
    return next(new ErrorResponse('Persons could not be found', 401));
  }
  res.status(200).json({
    success: true,
    data: persons,
  });
});

//@desc Get single person
//@route GET /api/v1/persons/:person_id
//@access Private/Admin
exports.getPerson = asyncHandler(async (req, res, next) => {
  const person = await Person.findByPk(req.params.person_id);

  if (!person) {
    return next(new ErrorResponse('Person could not be found', 401));
  }

  res.status(200).json({
    success: true,
    data: person,
  });
});

//@desc Query persons
//@route GET /api/v1/persons/query/:encodedQueryString
//@access Private/Admin
exports.queryPersons = asyncHandler(async (req, res) => {
  const { company_id } = req.user;
  let queryString = Buffer.from(
    req.params.encodedQueryString,
    'base64'
  ).toString('binary');
  //console.log(queryString);

  const persons = await Person.findAll({
    where: {
      [Sequelize.Op.and]: [
        { company_id },
        {
          [Sequelize.Op.or]: [
            {
              person_id: {
                [Sequelize.Op.eq]: isNaN(parseInt(queryString))
                  ? undefined
                  : queryString,
              },
            },
            {
              person_first_name: {
                [Sequelize.Op.like]: `%${queryString}%`,
              },
            },
            {
              person_last_name: {
                [Sequelize.Op.like]: `%${queryString}%`,
              },
            },
          ],
        },
      ],
    },
    include: [{ model: Position }, { model: User }],
    // limit: 10,
  });

  if (!persons) {
    return next(new ErrorResponse('Positions could not be found', 401));
  }
  res.status(200).json({
    success: true,
    data: persons,
  });
});

//@desc Create new person
//@route POST /api/v1/persons
//@access Private/Admin
exports.createPerson = asyncHandler(async (req, res, next) => {
  // Insert into table
  const { person_first_name, person_last_name } = req.body;
  const person = await Person.create({
    person_first_name,
    person_last_name,
  });

  res.status(200).json({
    success: true,
    data: person,
  });
});

//@desc Update a person
//@route PUT /api/v1/persons/:person_id
//@access Private/Admin
exports.updatePerson = asyncHandler(async (req, res, next) => {
  const { person_first_name, person_last_name } = req.body;
  // update a person
  const person = await Person.update(
    {
      person_first_name: person_first_name,
      person_last_name: person_last_name,
    },
    { where: { person_id: req.params.person_id }, returning: true, plain: true }
  );

  if (!person) {
    return next(new ErrorResponse('Person could not be updated', 401));
  }
  res.status(200).json({
    success: true,
    data: person[1],
  });
});

//@desc Delete a person
//@route DELETE /api/v1/persons/:person_id
//@access Private/Admin
exports.deletePerson = asyncHandler(async (req, res, next) => {
  // Delete person
  const person = await Person.destroy({
    where: { person_id: req.params.person_id },
  });
  if (!person) {
    return next(new ErrorResponse('Person could not be deleted', 401));
  }

  res.status(200).json({
    success: true,
    data: {},
  });
});
