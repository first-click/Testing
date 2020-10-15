const express = require('express');
const {
  createUser,
  getUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controllers/users');

const router = express.Router({ mergeParams: true });

router.route('/').get(getUsers).post(createUser);
router.route('/:id').put(updateUser).get(getUser).delete(deleteUser);

module.exports = router;
