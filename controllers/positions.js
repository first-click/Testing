const { sequelize, Sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Position = sequelize.models.position;

//@desc Get all positions
//@route GET /api/v1/positions
//@access Private/Admin
exports.getPositions = asyncHandler(async (req, res, next) => {
  const { company_id } = req.user;
  const positions = await Position.findAll({
    // include: 'persons',
    where: {
      company_id,
    },
    //limit: 50,
    limit: 5,
  });
  res.status(200).json({
    success: true,
    data: positions,
  });
});

//@desc Query positions
//@route GET /api/v1/positions/query/:encodedQueryString
//@access Private/Admin
exports.queryPositions = asyncHandler(async (req, res) => {
  const { company_id } = req.user;
  let queryString = Buffer.from(
    req.params.encodedQueryString,
    'base64'
  ).toString('binary');
  //console.log(queryString);

  const positions = await Position.findAll({
    where: {
      [Sequelize.Op.and]: [
        { company_id },
        {
          [Sequelize.Op.or]: [
            {
              position_id: {
                [Sequelize.Op.eq]: isNaN(parseInt(queryString))
                  ? undefined
                  : queryString,
              },
            },
            {
              position_title: {
                [Sequelize.Op.like]: `%${queryString}%`,
              },
            },
            {
              position_department: {
                [Sequelize.Op.like]: `%${queryString}%`,
              },
            },
            {
              position_department_short: {
                [Sequelize.Op.like]: `%${queryString}%`,
              },
            },
          ],
        },
      ],
    },
    // limit: 10,
  });

  if (!positions) {
    return next(new ErrorResponse('Positions could not be found', 401));
  }
  res.status(200).json({
    success: true,
    data: positions,
  });
});

//@desc Get a single position
//@route GET /api/v1/positions/:position_id
//@access Private/Admin
exports.getPosition = asyncHandler(async (req, res, next) => {
  const { company_id } = req.user;
  const position = await Position.findByPk(req.params.position_id, {
    // include: 'company', // optional: load corresponding company data
    // logging: console.log,
    // benchmark: true,
    include: ['company', 'persons'],
  });
  if (!position) {
    return next(new ErrorResponse('Position does not exist', 401));
  }
  if (position.company_id !== company_id) {
    return next(new ErrorResponse('Not authorized to access this data', 401));
  }
  res.status(200).json({
    success: true,
    data: position,
  });
});

//@desc Create a new position
//@route POST /api/v1/positions
//@access Private/Admin
exports.createPosition = asyncHandler(async (req, res, next) => {
  // man kann nur in der eigenen Company positions createn
  const { company_id } = req.user;
  const {
    position_title,
    position_department,
    position_department_short,
  } = req.body;
  console.log(req.body);
  const position = await Position.create({
    position_title,
    position_department,
    position_department_short,
    company_id,
  });

  if (!position) {
    return next(new ErrorResponse('Position could not be created', 401));
  }
  res.status(200).json({
    success: true,
    data: position,
  });
});

//@desc Update a position
//@route PUT /api/v1/positions/:position_id
//@access Private/Admin
exports.updatePosition = asyncHandler(async (req, res, next) => {
  const { company_id } = req.user;
  const { title, department, department_short } = req.body;

  const position = await Position.update(
    {
      company_id,
      title,
      department,
      department_short,
    },
    {
      where: { position_id: req.params.position_id },
      returning: true,
      plain: true,
    }
  );
  if (!position) {
    return next(new ErrorResponse('Position could not be updated', 401));
  }
  res.status(200).json({
    success: true,
    data: position[1],
  });
});

//@desc Delete a position
//@route DELETE /api/v1/positions/:position_id
//@access Private/Admin
exports.deletePosition = asyncHandler(async (req, res, next) => {
  const { company_id } = req.user;

  const count = await Position.destroy({
    where: { position_id: req.params.position_id, company_id },
  });
  if (count === 0) {
    return next(new ErrorResponse('Position not deleted', 400));
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
