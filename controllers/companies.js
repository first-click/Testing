const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Company = sequelize.models.company;

//@desc Get all companies
//@route GET /api/v1/companies
//@access Private/Admin
exports.getCompanies = asyncHandler(async (req, res) => {
  const companies = await Company.findAll({
    include: ['users'],
  });
  res.status(200).json({
    success: true,
    data: companies,
  });
});

//@desc Get a single company
//@route GET /api/v1/companies/:company_id
//@access Private/Admin
exports.getCompany = asyncHandler(async (req, res, next) => {
  const company = await Company.findByPk(req.params.company_id, {
    // include: ['persons', 'positions'], // problematische Suche
    where: {
      $company_id$: {
        [sequelize.Sequelize.Op.eq]: req.params.company_id,
      },
    },
    // include: ['persons', 'positions'],
    include: ['persons'],
  });
  // console.log(await company.getUsers())
  if (!company) {
    return next(new ErrorResponse('Company does not exist', 401));
  }
  res.status(200).json({
    success: true,
    data: company,
  });
});

//@desc Create a new company
//@route POST /api/v1/companies
//@access Private/Admin
exports.createCompany = asyncHandler(async (req, res) => {
  // const { title, department, department_short } = req.body;
  // const company = await Company.create({
  //   title,
  //   department,
  //   department_short,
  //   company_id,
  // });
  res.status(400).json({
    success: false,
    message: 'creating companies is not allowed',
  });
});

//@desc Update a company
//@route PUT /api/v1/companies/:company_id
//@access Private/Admin
exports.updateCompany = asyncHandler(async (req, res) => {
  // const { company_id } = req.user;
  // const { title, department, department_short } = req.body;

  // const company = await Company.update(
  //   {
  //     company_id,
  //     title,
  //     department,
  //     department_short,
  //   },
  //   { where: { company_id: req.params.company_id } }
  // );
  // res.status(200).json({
  //   success: true,
  //   data: company,
  // });
  res.status(400).json({
    success: false,
    message: 'updating companies is not allowed',
  });
});

//@desc Delete a company
//@route DELETE /api/v1/companies/:company_id
//@access Private/Admin
exports.deleteCompany = asyncHandler(async (req, res, next) => {
  const count = await Company.destroy({
    where: { company_id: req.params.company_id },
  });
  if (count === 0) {
    return next(new ErrorResponse('Company not deleted', 400));
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
