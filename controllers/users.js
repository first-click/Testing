const { sequelize } = require('../models');
const User = sequelize.models.User;

//@desc get all users
//@route GET /users/
//@access Public
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

//@desc Create new user
//@route POST /users/
//@access Public
exports.createUser = async (req, res) => {
  try {
    // Insert into table
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password

    });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
