const { sequelize } = require('../models');
const User = sequelize.models.User;

//@desc get all users
//@route Get /users/
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
//@route Post /users/
//@access Public
exports.createUser = async (req, res) => {
  try {
    // Insert into table
    const user = await User.create({
      name: req.body.name,
    });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
