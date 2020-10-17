const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');
const User = sequelize.models.user;

//const { getSigendJwtToken } = require('../middleware/auth')

//@desc get all users
//@route GET /api/v1/users
//@access Private/Admin
exports.getUsers = asyncHandler( (req, res) => {
    const users = await User.findAll();
    res.json(users);
  
});

//@desc get single user
//@route GET /api/v1/users/:id
//@access Private/Admin
exports.getUser = asyncHandler( (req, res) => {
    const user = await User.findByPk(req.params.id);
    res.json(user);
});

//@desc Create new user
//@route POST /api/v1/users
//@access Private/Admin
exports.createUser = asyncHandler( (req, res) => {
 
    // Insert into table
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    res.json(user);

});

//@desc Update a user
//@route PUT /api/v1/users/:id
//@access Private/Admin
exports.updateUser = asyncHandler( (req, res) => {
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
exports.deleteUser = asyncHandler( (req, res) => {
    // Delete user
    const user = await User.destroy({ where: { id: req.params.id } });
    res.status(200).json({
      success: true,
      data: {},
    });

});
