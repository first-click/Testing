const { sequelize } = require('../models');
const asyncHandler = require('../middleware/async');
const Job = sequelize.models.job;

//@desc get all jobs
//@route GET /api/v1/jobs
//@access Public
exports.getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.findAll();
  res.json(jobs);
});

//@desc get single job
//@route GET /api/v1/jobs/:id
//@access Public
exports.getJob = asyncHandler(async (req, res) => {
  const job = await Job.findByPk(req.params.id);
  res.json(job);
});

//@desc Create new job
//@route POST /api/v1/jobs
//@access Private
exports.createJob = asyncHandler(async (req, res) => {
  // Insert into table
  const { companyname, ... } = req.body;
  const job = await Job.create({
   companyname,
   ...
  });

  res.json(job);
});

//@desc Update a job
//@route PUT /api/v1/jobs/:id
//@access Private
exports.updateJob = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  // update a user
  const user = await User.update(
    {
      name: name,
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