const express = require('express');
const {
  createJob,
  getJob,
  getJobs,
  updateJob,
  deleteJob,
} = require('../controllers/jobs');

const router = express({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.route('/').get(getJobs).post(createJob);

router.route('/:id').put(updateJob).get(getJob).delete(deleteJob);

module.exports = router;
