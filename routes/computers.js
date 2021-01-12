const express = require('express');
const {
  getComputers,
  getComputer,
  createComputer,
  updateComputer,
  deleteComputer,
} = require('../controllers/computers');

const router = express({ mergeParams: true });

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router.route('/').get(getComputers).post(createComputer);

router
  .route('/:computer_id')
  .put(updateComputer)
  .get(getComputer)
  .delete(deleteComputer);

module.exports = router;
