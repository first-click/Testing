const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Posting = sequelize.models.posting;
const Posting_user = sequelize.models.posting_user;
const Benefit = sequelize.models.benefit;
const Position = sequelize.models.position;
const Posting_benefit = sequelize.models.posting_benefit;
const Posting_qualification = sequelize.models.posting_qualification;
const Qualification = sequelize.models.qualification;

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
exports.createPosting = asyncHandler(async (req, res) => {
  const { company_id } = req.user;

  const {
    posting_position_id,
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
    //warum geht transaction bei der ersten create nicht
    const posting = await Posting.create({
      position_id: posting_position_id,
      company_id,
      posting_startdate,
      posting_startdate,
      posting_enddate,
      posting_description,
      posting_working_hours,
      posting_contact_person,
      posting_contact_email,
      posting_contact_phonenumber,
      posting_salary,
    });
    // wie soll ich hier das error management machen?
    if (!posting_position_id) {
      return next(new ErrorResponse('Create a position for the posting', 404));
    }

    if (!company_id) {
      return next(new ErrorResponse('Create a company for the posting', 404));
    }

    if (!posting) {
      return next(new ErrorResponse('Posting could not be created', 401));
    }
    await Posting_user.create(
      {
        posting_id: posting.posting_id,
        user_id: req.user.user_id,
      },
      { transaction: t }
    );
    const benefits = await posting_benefits.filter(
      (benefit) => benefit.active === true
    );

    let sendBenefits = [];
    for (const benefit of benefits) {
      const benefitAvailable = await Benefit.findOne({
        where: { benefit: benefit.label },
      });

      if (benefitAvailable === null) {
        await Benefit.create({
          benefit: benefit.label,
        }),
          { transaction: t };
      }
      const postingBenefit = await Benefit.findOne({
        where: { benefit: benefit.label },
      });
      sendBenefits.push(postingBenefit);
      await Posting_benefit.create({
        benefit_id: postingBenefit.benefit_id,
        posting_id: posting.posting_id,
      }),
        { transaction: t };
    }
    let sendQualifications = [];
    for (const qualification of posting_qualifications) {
      const qualificationAvailable = await Qualification.findOne({
        where: { qualification },
      });
      if (qualificationAvailable === null) {
        await Qualification.create({
          qualification,
        }),
          { transaction: t };
      }
      const postingQualification = await Qualification.findOne({
        where: { qualification },
      });
      sendQualifications.push(postingQualification);
      await Posting_qualification.create({
        qualification_id: postingQualification.qualification_id,
        posting_id: posting.posting_id,
      }),
        { transaction: t };
    }

    posting.dataValues.posting_benefits = sendBenefits;
    posting.dataValues.posting_qualifications = sendQualifications;
    console.log(posting);
    res.status(200).json({
      success: true,
      data: posting,
    });
  });
});

//@desc Update a post
//@route PUT /api/v1/postings/:posting_id
//@access Private/Admin
exports.updatePosting = asyncHandler(async (req, res, next) => {
  const company_id = req.user.company_id;
  const {
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

  const position = await Position.update(
    { position_title, position_department, position_department_short },
    { where: { position_title, company_id: company_id } }
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
