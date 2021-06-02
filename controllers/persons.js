const { sequelize, Sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Person = sequelize.models.person;
const Position = sequelize.models.position;
const User = sequelize.models.user;
const Applicant_filename = sequelize.models.applicant_filename;
const Person_applicant_filename = sequelize.models.person_applicant_filename;

const formidable = require('formidable');
var fs = require('fs');
var path = require('path');
const { getFileStream } = require('../s3');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);
const S3 = require('aws-sdk/clients/s3');
const dotenv = require('dotenv');

// require('./utils/logOrigin');

// Load env vars
dotenv.config({ path: './config/config.env' });

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_KEY;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

//@desc Get all persons
//@route GET /api/v1/persons
//@access Private/Admin
exports.getPersons = asyncHandler(async (req, res, next) => {
  const { company_id } = req.user;
  const persons = await Person.findAll({
    where: { company_id },
    include: [{ model: Position }, { model: User }],
  });

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
  const { company_id } = req.user;
  const person = await Person.findAll({
    where: {
      company_id,
      person_id: req.params.person_id,
    },
    include: [{ model: Position }, { model: User }],
    plain: true,
  });
  // const person = await Person.findByPk(req.params.person_id, {
  //   include: [{ model: Position }, { model: User }],
  // });

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
  console.log('queryString:', queryString);
  if (queryString === '') {
    console.log('ooops');
    return res.status(200).json({
      success: true,
      data: [],
    });
  }

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

//@get pdf from s3 bucket send to frontend
//@route GET /api/v1/persons/pdf/:key
//@access Private/Admin
exports.getFile = asyncHandler(async (req, res, next) => {
  // console.log(req.params);
  // unlink file!!!
  const key = req.params.key;
  const readStream = getFileStream(key);
  await readStream.pipe(res);
});

//@desc Create new person
//@route POST /api/v1/persons
//@access Private/Admin
exports.createPerson = asyncHandler(async (req, res, next) => {
  const { user_id } = req.user;
  let newPerson = {};
  let fileChange = [];
  let sendApplicantUploads = [];

  const form = formidable({
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(new ErrorResponse('Person could not be created', 401));
    }
    if (fields) {
      newPerson = await Person.create({
        person_first_name: fields.applicant_firstname,
        person_last_name: fields.applicant_last_name,
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
      });
    }

    if (files) {
      // noch eine funktion schreiben, wenn ich ein file nur habe
      for (const file of files.file) {
        const pathFile = 'uploads/';

        fs.rename(file.path, path.join(pathFile, file.name), (err) => {
          if (err) {
            return next(new ErrorResponse('Person could not be created', 401));
          }
        });

        fileChange = {
          ...file,
          path: `uploads/${file.name}`,
        };

        const fileStream = fs.createReadStream(fileChange.path);

        const uploadParams = {
          Bucket: bucketName,
          Body: fileStream,
          Key: fileChange.name,
        };

        const s3Data = await s3.upload(uploadParams).promise();

        const applicantFilename = await Applicant_filename.create({
          filename: `/api/v1/persons/pdf/${s3Data.key}`,
        });

        sendApplicantUploads.push(applicantFilename.dataValues.filename);

        await Person_applicant_filename.create({
          person_id: newPerson.person_id,
          applicant_filename_id: applicantFilename.applicant_filename_id,
        });
        // await unlinkFile(file.path)
      }
    }

    newPerson.dataValues.uploads = sendApplicantUploads;

    await res.status(200).json({
      success: true,
      data: newPerson,
    });
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
