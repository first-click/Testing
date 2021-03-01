const express = require('express');
const { getPersons } = require('../controllers/persons');

const router = express({ mergeParams: true });
//const { protect } = require('../middleware/auth');

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router.route('/').get(getPersons);

module.exports = router;
