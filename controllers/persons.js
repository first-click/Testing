const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Person = sequelize.models.person;
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

//@get pdf from s3 bucket send to frontend
//@route GET /api/v1/persons/pdf/:key
//@access Private/Admin
exports.getFile = asyncHandler(async (req, res, next) => {
  // console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);
  await readStream.pipe(res);
});

// exports.createPerson = asyncHandler(async (req, res, next) => {
//   const { user_id } = req.user;
//   let newPerson = {};
//   let fileChange = [];
//   let sendApplicantUploads = ['hello'];

//   const form = await formidable({
//     multiples: true,
//   });

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return next(new ErrorResponse('Person could not be created', 401));
//     }
//     if (fields) {
//       console.log('in if(fields)');
//       newPerson = await Person.create({
//         person_first_name: fields.applicant_firstname,
//         person_surname: fields.applicant_surname,
//         person_email: fields.applicant_email,
//         person_phonenumber: fields.applicant_phonenumber,
//         person_applicant_message_hiring_manager:
//           fields.applicant_message_hiring_manager,
//         person_linkedin: fields.applicant_linkedin,
//         person_xing: fields.applicant_xing,
//         person_applicant_data_protection: fields.applicant_data_protection,
//         company_id: fields.company_id,
//         position_id: fields.position_id,
//         user_id: user_id,
//       });
//     }
//     if (files) {

//       files.file.map(async (file) => {
//         // const pathFile = 'uploads/';

//         // fs.rename(file.path, path.join(pathFile, file.name), (err) => {
//         //   if (err) {
//         //     return next(new ErrorResponse('Person could not be created', 401));
//         //   }
//         // });

//         fileChange = {
//           ...file,
//           path: `uploads/${file.name}`,
//         };

//         const fileStream = fs.createReadStream(fileChange.path);

//         const uploadParams = {
//           Bucket: bucketName,
//           Body: fileStream,
//           Key: fileChange.name,
//         };

//         const s3Data = await s3.upload(uploadParams).promise();

//         const applicantFilename = await Applicant_filename.create({
//           filename: `/api/v1/persons/pdf/${s3Data.key}`,
//         });

//         console.log('before sendApplicantUploads.push()');
//         sendApplicantUploads.push(applicantFilename.dataValues.filename);
//         // newPerson.dataValues.uploads.push(
//         //   applicantFilename.dataValues.filename
//         // );

//         console.log('before Person_applicant_filename.create()');
//         await Person_applicant_filename.create({
//           person_id: newPerson.person_id,
//           applicant_filename_id: applicantFilename.applicant_filename_id,
//         });
//       });
//     }

//     await res.status(200).json({
//       success: true,
//       data: newPerson,
//     });
//   });
// });

//@desc Create new person
//@route POST /api/v1/persons
//@access Private/Admin
exports.createPerson = asyncHandler(async (req, res, next) => {
  const { user_id } = req.user;
  let newPerson = {};
  let fileChange = [];
  let sendApplicantUploads = [];

  const form = await formidable({
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(new ErrorResponse('Person could not be created', 401));
    }
    if (fields) {
      newPerson = await Person.create({
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
      });
    }
    if (files) {
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
      }
    }

    newPerson.dataValues.uploads = sendApplicantUploads;

    console.log(newPerson);
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
