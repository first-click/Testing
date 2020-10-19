const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');
const User = sequelize.models.user;

//@desc get all users
//@route GET /api/v1/users
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  res.json(users);
});

//@desc get single user
//@route GET /api/v1/users/:id
//@access Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.json(user);
});

//@desc Create new user
//@route POST /api/v1/users
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  // Insert into table
  const { username, email, password, role } = req.body;
  const user = await User.create({
    username,
    email,
    password,
    role,
  });

  res.json(user);
});

//@desc Update a user
//@route PUT /api/v1/users/:id
//@access Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  // update a user
  const user = await User.update(
    {
      username: username,
      email: email,
    },
    { where: { id: req.params.id } }
  );

  res.json(user);
});

//@desc Delete a user
//@route DELETE /api/v1/users/:id
//@access Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  // Delete user
  const user = await User.destroy({ where: { id: req.params.id } });
  res.status(200).json({
    success: true,
    data: {},
  });
});
