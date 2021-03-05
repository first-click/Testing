const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const User = sequelize.models.user;
const Person = sequelize.models.person;

//@desc Get all users
//@route GET /api/v1/users
//@access Private/Admin
exports.getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll({});
  res.status(200).json({
    success: true,
    data: users,
  });
});

// //@desc search Post
// //@route GET /api/v1/posts
// //@access Public
// exports.getP = asyncHandler(async (req, res) => {
//   const post = await sequelize.query(
//     `
// SELECT *
// FROM ${Post.tableName}
// WHERE _search @@ plainto_tsquery('english', :query);
// `,
//     {
//       model: Post,
//       replacements: { query: 'one1' },
//     }
//   );
//   res.json(post);
// });

// //@desc Get single user
// //@route GET /api/v1/users/:user_id
// //@access Private/Admin
// exports.getUser = asyncHandler(async (req, res) => {
//   const user = await sequelize.query(`
//   WITH RECURSIVE u AS (
//     SELECT company_id
//     FROM  users
//     WHERE  company_id = 1
//     UNION ALL
//     SELECT company_id
//             FROM   users
//             WHERE  company_id = 1)

//  SELECT company_id
//  FROM   u
//  WHERE  company_id = 1;
//   `);

//   res.status(200).json({
//     success: true,
//     data: user,
//   });
// });

//@desc Get single user
//@route GET /api/v1/users/:user_id
//@access Private/Admin
exports.getUser = asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.user_id, {
    include: ['person'],
    // include: { all: true },
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

//@desc Create new user
//@route POST /api/v1/users
//@access Private/Admin
exports.createUser = asyncHandler(async (req, res) => {
  // Insert into table
  const { name, email, password, role, company_id } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
    company_id,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
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
    { where: { user_id: req.params.user_id }, returning: true, plain: true }
  );
  res.status(200).json({
    success: true,
    data: user[1],
  });
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
