const express = require('express');
const {
  getPositions,
  getPosition,
  createPosition,
  updatePosition,
  deletePosition,
} = require('../controllers/positions');

const router = express({ mergeParams: true });
const { protect } = require('../middleware/auth');

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router.route('/').get(protect, getPositions).post(protect, createPosition);

router
  .route('/:position_id')
  .put(protect, updatePosition)
  .get(protect, getPosition)
  .delete(protect, deletePosition);

module.exports = router;
