const express = require('express');
const {
  createPerson,
  getPerson,
  getPersons,
  updatePerson,
  deletePerson,
  queryPersons,
} = require('../controllers/persons');

const router = express({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

//router.use(protect);
//router.use(authorize('admin'));

router.route('/').get(protect, getPersons).post(protect, createPerson);
router.route('/query/:encodedQueryString').get(protect, queryPersons);

router
  .route('/:person_id')
  .get(protect, getPerson)
  .put(protect, updatePerson)
  .delete(protect, deletePerson);

module.exports = router;
