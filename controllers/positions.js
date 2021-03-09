const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Position = sequelize.models.position;

//@desc Get all positions
//@route GET /api/v1/positions
//@access Private/Admin
exports.getPositions = asyncHandler(async (req, res, next) => {
  const { company_id } = req.user;
  const positions = await Position.findAll(
    // { include: 'person' }
    {
      where: {
        company_id,
      },
    }
  );

  if (!postions) {
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
  // Insert into table
  const { company_id } = req.user; // man kann nur in der eigenen Company positions createn
  const { title, department, department_short } = req.body;
  const position = await Position.create({
    title,
    department,
    department_short,
    company_id,
  });

  if (!position) {
    return next(new ErrorResponse('Position couls not be created', 401));
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
