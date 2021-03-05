const express = require('express');
const {
  createPerson,
  getPerson,
  getPersons,
  updatePerson,
  deletePerson,
} = require('../controllers/persons');

const router = express({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

//router.use(protect);
//router.use(authorize('admin'));

router.route('/').get(getPerson).post(createPerson);

router
  .route('/:person_id')
  .put(updatePerson)
  .get(getPerson)
  .delete(deletePerson);

module.exports = router;
