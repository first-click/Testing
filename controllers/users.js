const { sequelize } = require('../models');
const User = sequelize.models.User;
//const { getSigendJwtToken } = require('../middleware/auth')

//@desc get all users
//@route GET /api/v1/users
//@access Public
exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

//@desc get single user
//@route GET /api/v1/users/:id
//@access Public
exports.getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

//@desc Create new user
//@route POST /api/v1/users
//@access Public
exports.createUser = async (req, res) => {
  try {
    // Insert into table
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    res.json(user);
  } catch (error) {
    console.log(error);
  }
};

//@desc Update a user
//@route PUT /api/v1/users/:id
//@access Public
exports.updateUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // update a user
    if (username || email || password) {
      const user = await User.update(
        {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
        },
        { where: { id: req.params.id } }
      );

      res.json(user);
    } else {
      res.json({ msg: 'No changes were made' });
    }
  } catch (error) {
    console.log(error);
  }
};

//@desc Delete a user
//@route DELETE /api/v1/users/:id
//@access Public
exports.deleteUser = async (req, res) => {
  try {
    // Insert into table
    const user = await User.destroy({ where: { id: req.params.id } });
    res.json(user);
  } catch (error) {
    console.log(error);
  }
};
