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

router.route('/').get(getPersons).post(createPerson);
router.route('/query/:encodedQueryString').get(protect, queryPersons);

router
  .route('/:person_id')
  .put(updatePerson)
  .get(getPerson)
  .delete(deletePerson);

module.exports = router;
