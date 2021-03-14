const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Posting = sequelize.models.posting;
const Posting_user = sequelize.models.posting_user;
const Company = sequelize.models.company;
const Company_user = sequelize.models.company_user;
const Position = sequelize.models.position;

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
    company_name,
    position_title,
    position_department,
    position_department_short,
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

  await sequelize.transaction(async (t) => {
    // Check if company exists and user is part of the company
    const company = await Company.findOne({
      where: { company_name },
      raw: true,
    });

    const company_user = await Company_user.findOne({
      where: {
        company_id: company.company_id,
        user_id: req.user.user_id,
      },
      raw: true,
    });
    // create position and posting
    if (company_user.company_id === company.company_id) {
      const position = await Position.create({
        position_title,
        position_department,
        position_department_short,
        company_id: company.company_id,
      });

      const posting = await Posting.create(
        {
          position_id: position.position_id,
          company_id: company.company_id,
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
        },
        { transaction: t }
      );

      await Posting_user.create(
        {
          posting_id: posting.posting_id,
          user_id: req.user.user_id,
        },
        { transaction: t }
      );

      return res.status(200).json({
        success: true,
        data: posting,
      });
    }
  });
});

//@desc Update a post
//@route PUT /api/v1/postings/:posting_id
//@access Private/Admin
exports.updatePosting = asyncHandler(async (req, res, next) => {
  const {
    company_name,
    position_title,
    position_department,
    position_department_short,
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

  const company = await Company.findOne({
    company_name,
  });

  const position = await Position.update(
    { position_title, position_department, position_department_short },
    { where: { position_title, company_id: company.company_id } }
  );

  // update a posting
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

  if (!posting || !position) {
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
