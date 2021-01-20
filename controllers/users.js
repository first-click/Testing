const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');
const User = sequelize.models.user;
const Person = sequelize.models.person;

//@desc Get all users
//@route GET /api/v1/users
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({ include: 'computers' });
  res.json(users);
});

//@desc Get single user
//@route GET /api/v1/users/:user_id
//@access Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.user_id, {
    include: ['computers', 'person', 'departments'],
    // include: { all: true },
  });
  // console.log(await user.getComputers());

  const person = await user.createPerson({
    person_first_name: 'Julian',
    person_last_name: 'Leweling',
  });
  console.log(person);

  res.json(user);
});

//@desc Create new user
//@route POST /api/v1/users
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  // Insert into table
  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  res.json(user);
});

//@desc Update a user
//@route PUT /api/v1/users/:user_id
//@access Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // update a user
  const user = await User.update(
    {
      name: name,
      email: email,
    },
    { where: { user_id: req.params.user_id } }
  );

  res.json(user);
});

//@desc Delete a user
//@route DELETE /api/v1/users/:user_id
//@access Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
  // Delete user
  const user = await User.destroy({ where: { user_id: req.params.user_id } });
  res.status(200).json({
    success: true,
    data: {},
  });
});
