const express = require('express');
const {
  createPerson,
  getFile,
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

// Petras Version:
//router.route('/').get(getPersons).post(protect, createPerson);
router.route('/query/:encodedQueryString').get(protect, queryPersons);

router.route('/pdf/:key').get(getFile);
router
  .route('/:person_id')
  .get(protect, getPerson)
  .put(protect, updatePerson)
  .delete(protect, deletePerson);
router.route('/').get(protect, getPersons).post(protect, createPerson);

module.exports = router;
