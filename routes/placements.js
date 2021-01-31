const express = require('express');
const {
  getPersonPosition,
  getPersonsPositions,
} = require('../controllers/placements');

const router = express({ mergeParams: true });
const { protect } = require('../middleware/auth');

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router.route('/').get(protect, getPersonsPositions);
// .post(protect, createPosition);

router.route('/:person_id/:position_id').get(protect, getPersonPosition);
//   .put(protect, updatePosition)
//   .get(protect, getPosition)
//   .delete(protect, deletePosition);

module.exports = router;
