const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');
const Computer = sequelize.models.computer;

//@desc Get all computers
//@route GET /api/v1/computers
//@access Private/Admin
exports.getComputers = asyncHandler(async (req, res) => {
  const computers = await Computer.findAll({ include: 'user' });
  res.json(computers);
});

//@desc Get a single computer
//@route GET /api/v1/computers/:computer_id
//@access Private/Admin
exports.getComputer = asyncHandler(async (req, res) => {
  const computer = await Computer.findByPk(req.params.computer_id, {
    include: 'user',
  });
  console.log(await computer.getUser());
  res.json(computer);
});

//@desc Create a new computer
//@route POST /api/v1/computers
//@access Private/Admin
exports.createComputer = asyncHandler(async (req, res) => {
  // Insert into table
  const { serial_number, user_id } = req.body;
  const computer = await Computer.create({
    serial_number,
    user_id,
  });

  res.json(computer);
});

//@desc Update a computer
//@route PUT /api/v1/computers/:computer_id
//@access Private/Admin
exports.updateComputer = asyncHandler(async (req, res) => {
  const { serial_number, user_id } = req.body;
  // update a user
  const computer = await Computer.update(
    {
      serial_number: serial_number,
      user_id: user_id,
    },
    { where: { computer_id: req.params.computer_id } }
  );

  res.json(computer);
});

//@desc Delete a computer
//@route DELETE /api/v1/computers/:computer_id
//@access Private/Admin
exports.deleteComputer = asyncHandler(async (req, res) => {
  // Delete computer
  const computer = await Computer.destroy({
    where: { computer_id: req.params.computer_id },
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});
