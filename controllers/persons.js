const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Person = sequelize.models.person;
const formidable = require('formidable');

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

//@desc Create new person
//@route POST /api/v1/persons
//@access Private/Admin
exports.createPerson = asyncHandler(async (req, res, next) => {
  const { user_id } = req.user;
  let filePath = null;
  console.log(__dirname);
  new formidable.IncomingForm()
    .parse(req)
    .on('fileBegin', (name, file) => {
      file.path =
        '/Users/petrakohler/Desktop/firstClick/client/public/uploads/' +
        file.name;
      filePath = file.path;
    })
    .on('file', (name, file) => {
      console.log('Uploaded file', name, file);
    });
  // __dirname + '/uploads/' + new Date().toISOString() + file.name;
  const form = formidable({ multiples: true });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(new ErrorResponse('Person could not be created', 401));
    }
    if (fields) {
      const newPerson = await Person.create({
        person_first_name: fields.applicant_firstname,
        person_surname: fields.applicant_surname,
        person_email: fields.applicant_email,
        person_phonenumber: fields.applicant_phonenumber,
        person_applicant_message_hiring_manager:
          fields.applicant_message_hiring_manager,
        person_linkedin: fields.applicant_linkedin,
        person_xing: fields.applicant_xing,
        person_applicant_data_protection: fields.applicant_data_protection,
        company_id: fields.company_id,
        position_id: fields.position_id,
        user_id: user_id,
        person_applicant_upload: filePath,
      });
      res.status(200).json({
        success: true,
        data: newPerson,
      });
    }
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
