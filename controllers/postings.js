const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Posting = sequelize.models.posting;

//@desc Get all postings
//@route GET /api/v1/postings
//@access Private/Admin
exports.getPostings = asyncHandler(async (req, res) => {
  const postings = await Posting.findAll({});
  res.status(200).json({
    success: true,
    data: postings,
  });
});

//@desc Get single post
//@route GET /api/v1/posts/:post_id
//@access Private/Admin
exports.getPosting = asyncHandler(async (req, res) => {
  const posting = await Posting.findByPk(req.params.posting_id);
  console.log(posting);
  res.status(200).json({
    success: true,
    data: posting,
  });
});

//@desc Create new posting
//@route POST /api/v1/postings
//@access Private/Admin
exports.createPosting = asyncHandler(async (req, res) => {
  // Insert into table
  const {
    position_id,
    company_id,
    posting_startdate,
    posting_enddate,
    posting_description,
    posting_benefits,
    posting_qualifications,
    posting_working_hours,
    posting_contact_person,
    posting_contact_email,
    posting_contact_phonenumber,
    posting_salary,
  } = req.body;
  const posting = await Posting.create({
    position_id,
    company_id,
    posting_startdate,
    posting_startdate,
    posting_enddate,
    posting_description,
    posting_benefits,
    posting_qualifications,
    posting_working_hours,
    posting_contact_person,
    posting_contact_email,
    posting_contact_phonenumber,
    posting_salary,
  });
  res.status(200).json({
    success: true,
    data: posting,
  });
});

//@desc Update a post
//@route PUT /api/v1/postings/:posting_id
//@access Private/Admin
exports.updatePosting = asyncHandler(async (req, res) => {
  const {
    posting_startdate,
    posting_enddate,
    posting_description,
    posting_benefits,
    posting_qualifications,
    posting_working_hours,
    posting_contact_person,
    posting_contact_email,
    posting_contact_phonenumber,
    posting_salary,
  } = req.body;
  // update a person
  const posting = await Posting.update(
    {
      posting_startdate,
      posting_enddate,
      posting_description,
      posting_benefits,
      posting_qualifications,
      posting_working_hours,
      posting_contact_person,
      posting_contact_email,
      posting_contact_phonenumber,
      posting_salary,
    },
    {
      where: { posting_id: req.params.posting_id },
      returning: true,
      plain: true,
    }
  );
  res.status(200).json({
    success: true,
    data: posting[1],
  });
});

//@desc Delete a posting
//@route DELETE /api/v1/postings/:posting_id
//@access Private/Admin
exports.deletePosting = asyncHandler(async (req, res) => {
  const posting = await Posting.destroy({
    where: { posting_id: req.params.posting_id },
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});
