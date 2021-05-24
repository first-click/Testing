const express = require('express');
const {
  createPerson,
  getFile,
  getPerson,
  getPersons,
  updatePerson,
  deletePerson,
} = require('../controllers/persons');

const router = express({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

//router.use(protect);
//router.use(authorize('admin'));

router.route('/').get(getPersons).post(protect, createPerson);

router.route('/pdf/:key').get(getFile);
router
  .route('/:person_id')
  .put(updatePerson)
  .get(getPerson)
  .delete(deletePerson);

module.exports = router;
