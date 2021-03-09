const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = sequelize.models.user;
const Role = sequelize.models.role;
const Role_user = sequelize.models.role_user;

//@desc Get all users
//@route GET /api/v1/users
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.findAll({});
  if (!users) {
    return next(new ErrorResponse(`Users not found`, 404));
  }
  res.status(200).json({
    success: true,
    data: users,
  });
});

//@desc Get single user
//@route GET /api/v1/users/:user_id
//@access Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByPk(req.params.user_id, {
    include: ['person'],
    // include: { all: true },
  });

  if (!user) {
    return next(new ErrorResponse(`User not found`, 404));
  }

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Create new user
//@route POST /api/v1/users
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  // Insert into table
  const {
    name,
    email,
    password,
    role,
    user_generalrole,
    postingrole_user,
  } = req.body;

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const role_posting = await Role.findAll({
    where: { role_user: postingrole_user },
  });

  const user_role = await Role.findAll({
    where: { role_user: user_generalrole },
  });

  const role_user_posting = await Role_user.bulkCreate([
    {
      role_id: role_posting[0].dataValues.role_id,
      user_id: user.user_id,
      role_user: postingrole_user,
    },
    {
      role_id: user_role[0].dataValues.role_id,
      user_id: user.user_id,
      role_user: user_generalrole,
    },
  ]);

  if (!user && !role_posting && !role_user_posting) {
    return next(new ErrorResponse('User could not be created', 401));
  }
  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Update a user
//@route PUT /api/v1/users/:user_id
//@access Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;
  // update a user
  const user = await User.update(
    {
      name: name,
      email: email,
    },
    { where: { user_id: req.params.user_id }, returning: true, plain: true }
  );

  if (!user) {
    return next(new ErrorResponse(`User could not be updated`, 404));
  }

  res.status(200).json({
    success: true,
    data: user[1],
  });
});

//@desc Delete a user
//@route DELETE /api/v1/users/:user_id
//@access Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  // Delete user
  const user = await User.destroy({ where: { user_id: req.params.user_id } });

  if (!user) {
    return next(new ErrorResponse(`User could not be deleted`, 404));
  }
  res.status(200).json({
    success: true,
    data: {},
  });
});
