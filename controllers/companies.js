const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Company = sequelize.models.company;
const User = sequelize.models.user;
const Address = sequelize.models.address;
const Address_company = sequelize.models.address_company;

//@desc Query company
//@route GET /api/v1/companies/query/:encodedQueryString
//@access Private/Admin
//@desc search company

exports.queryCompanies = asyncHandler(async (req, res) => {
  let queryString = Buffer.from(
    req.params.encodedQueryString,
    'base64'
  ).toString('binary');

  const companies = await sequelize.query(
    `
  SELECT *
  FROM ${Company.tableName}

  WHERE _search @@ to_tsquery('simple', :query );
  
  `,
    {
      model: Company,
      replacements: { query: `${queryString}:*` },
    }
  );

  let foundCompanies = [];
  for (const company of companies) {
    const companyAddress = await Company.findOne({
      where: { company_id: company.dataValues.company_id },
      include: [Address],
    });
    foundCompanies.push(companyAddress);
  }

  return res.status(200).json({
    success: true,
    data: foundCompanies,
  });
});

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
  // Merge conflict, habe meine Variante auskommentiert (JL)
  // const company = await Company.findByPk(req.params.company_id, {
  //   where: {
  //     $company_id$: {
  //       [sequelize.Sequelize.Op.eq]: req.params.company_id,
  //     },
  //   },
  //   include: ['persons'],
  // });

  const company = await Company.findOne({
    where: { company_id: req.params.company_id },
    include: [Address],
  });
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
  const user_id = req.user.user_id;

  const {
    company_name,
    address_street_name,
    address_house_number,
    address_postal_code,
    address_city,
    address_country,
  } = req.body;

  await sequelize.transaction(async (t) => {
    //warum geht transaction bei der ersten create nicht
    // ist update zu schnell?

    const companyExists = await Company.findOne({
      where: { company_name },
      include: [Address],
    });

    if (companyExists) {
      await User.update(
        { company_id: companyExists.company_id },
        { where: { user_id } },
        { transaction: t }
      );
      res.status(200).json({
        success: true,
        data: companyExists,
      });
    }
    if (!companyExists) {
      const company = await Company.create({ company_name });

      await User.update(
        { company_id: company.company_id },
        { where: { user_id } },
        { transaction: t }
      );
      // noch die Addresse suchen, bevor ich sie create
      const address = await Address.create(
        {
          address_street_name,
          address_house_number,
          address_postal_code,
          address_city,
          address_country,
        },
        { transaction: t }
      );

      await Address_company.create(
        {
          address_id: address.address_id,
          company_id: company.company_id,
        },
        { transaction: t }
      );
      company.dataValues.addresses = [address];
      res.status(200).json({
        success: true,
        data: company,
      });
    }
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
