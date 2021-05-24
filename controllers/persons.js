const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Person = sequelize.models.person;
const Applicant_filename = sequelize.models.applicant_filename;
const Person_applicant_filename = sequelize.models.person_applicant_filename;
const formidable = require('formidable');
var fs = require('fs');
var path = require('path');
const { uploadFile, getFileStream } = require('../s3');
const util = require('util');
const unlinkFile = util.promisify(fs.unlink);

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
// exports.createPerson = asyncHandler(async (req, res, next) => {
//   const { user_id } = req.user;
//   let fileNames = [];
//   let newPerson = {};
//   let fileChange = [];
//   let result = {};

//   const form = await formidable({
//     multiples: true,
//   });

//   form.parse(req, async (err, fields, files) => {
//     if (err) {
//       return next(new ErrorResponse('Person could not be created', 401));
//     }
//     if (files) {
//       files.file.map(async (file) => {
//         // const pathFile =
//         //   '/Users/petrakohler/Desktop/firstClick/client/public/uploads/';

//         // fs.rename(file.path, path.join(pathFile, file.name), (err) => {
//         //   if (err) {
//         //     return next(new ErrorResponse('Person could not be created', 401));
//         //   }
//         // });

//         // const result = await uploadFile({
//         //   ...file,
//         //   path: `/Users/petrakohler/Desktop/firstClick/client/public/uploads/${file.name}`,
//         // });

//         fileChange = {
//           ...file,
//           path: `uploads/${file.name}`,
//         };

//         result = await uploadFile(fileChange);
//         console.log(result);

//         fileNames.push(file.name);

//         // file.path =
//         //   '/Users/petrakohler/Desktop/firstClick/client/public/uploads/' +
//         //   new Date().toISOString() +
//         //   file.name;
//       });
//     }

//     if (fields) {
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

//     let sendApplicantUploads = [];
//     for (const filename of fileNames) {
//       const applicantFilename = await Applicant_filename.create({
//         filename: `./uploads/${filename}`,
//       });

//       sendApplicantUploads.push(applicantFilename);

//       await Person_applicant_filename.create({
//         person_id: newPerson.person_id,
//         applicant_filename_id: applicantFilename.applicant_filename_id,
//       });
//     }

//     newPerson.dataValues.uploads = sendApplicantUploads;

//     // await res.write({ pdfPath: `/pdf/${result.Key}` });
//     // await res.end();
//     res.send({ pdfPath: '/api/v1/persons/pdf/lebenslauf-dunkel.pdf' });
//     // res.write.json({
//     //   success: true,
//     //   data: newPerson,
//     // });

//     // res.end();
//   });
// });

//@get pdf from s3 bucket send to frontend
//@route GET /api/v1/persons/pdf/:key
//@access Private/Admin
exports.getFile = asyncHandler(async (req, res, next) => {
  // console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key);
  console.log(res);
  await readStream.pipe(res);
});

exports.createPerson = asyncHandler(async (req, res, next) => {
  const { user_id } = req.user;
  let fileNames = [];
  let newPerson = {};
  let fileChange = [];
  let result = {};

  const form = await formidable({
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return next(new ErrorResponse('Person could not be created', 401));
    }
    if (files) {
      files.file.map(async (file) => {
        // const pathFile = 'uploads/';

        // fs.rename(file.path, path.join(pathFile, file.name), (err) => {
        //   if (err) {
        //     return next(new ErrorResponse('Person could not be created', 401));
        //   }
        // });

        fileChange = {
          ...file,
          path: `uploads/${file.name}`,
        };

        result = await uploadFile(fileChange);
        console.log(result);

        fileNames.push(result.Key);
      });
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

    let sendApplicantUploads = [];
    for (const filename of fileNames) {
      const applicantFilename = await Applicant_filename.create({
        filename: `/api/v1/persons/pdf/${filename}`,
      });

      sendApplicantUploads.push(applicantFilename);

      await Person_applicant_filename.create({
        person_id: newPerson.person_id,
        applicant_filename_id: applicantFilename.applicant_filename_id,
      });
    }

    newPerson.dataValues.uploads = sendApplicantUploads;

    //  res.write({ pdfPath: `/pdf/${result.Key}` });
    //  res.end();
    // res.send({ pdfPath: '/api/v1/persons/pdf/lebenslauf-dunkel.pdf' });
    res.status(200).json({
      success: true,
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
