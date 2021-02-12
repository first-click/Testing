const express = require('express');
const { getEmployees } = require('../controllers/employees');

const router = express({ mergeParams: true });
//const { protect } = require('../middleware/auth');

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router.route('/').get(getEmployees);

module.exports = router;
