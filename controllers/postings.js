const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Posting = sequelize.models.posting;
const Posting_user = sequelize.models.posting_user;

//@desc Get all postings
//@route GET /api/v1/postings
//@access Private/Admin
exports.getPostings = asyncHandler(async (req, res, next) => {
  const postings = await Posting.findAll({});
  if (!postings) {
    return next(new ErrorResponse(`Postings not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: postings,
  });
});

//@desc Get single post
//@route GET /api/v1/posts/:post_id
//@access Private/Admin
exports.getPosting = asyncHandler(async (req, res, next) => {
  const posting = await Posting.findByPk(req.params.posting_id);

  if (!posting) {
    return next(new ErrorResponse(`Posting not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: posting,
  });
});

//@desc Create new posting
//@route POST /api/v1/postings
//@access Private/Admin
exports.createPosting = asyncHandler(async (req, res, next) => {
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

  const posting_user = await Posting_user.create({
    posting_id: posting.posting_id,
    user_id: user_id,
  });

  if (!posting && !posting_user) {
    return next(new ErrorResponse(`Posting could not be created`, 404));
  }

  res.status(200).json({
    success: true,
    data: posting,
  });
});

//@desc Update a post
//@route PUT /api/v1/postings/:posting_id
//@access Private/Admin
exports.updatePosting = asyncHandler(async (req, res, next) => {
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

  if (!posting) {
    return next(new ErrorResponse(`Posting could not be updated`, 404));
  }
  res.status(200).json({
    success: true,
    data: posting[1],
  });
});

//@desc Delete a posting
//@route DELETE /api/v1/postings/:posting_id
//@access Private/Admin
exports.deletePosting = asyncHandler(async (req, res, next) => {
  const posting = await Posting.destroy({
    where: { posting_id: req.params.posting_id },
  });

  if (!posting) {
    return next(new ErrorResponse(`Posting could not be deleted`, 404));
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
