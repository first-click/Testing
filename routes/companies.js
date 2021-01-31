const express = require('express');
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} = require('../controllers/companies');

const router = express({ mergeParams: true });
const { protect } = require('../middleware/auth');

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router.route('/').get(protect, getCompanies).post(protect, createCompany);

router
  .route('/:company_id')
  .put(protect, updateCompany)
  .get(protect, getCompany)
  .delete(protect, deleteCompany);

module.exports = router;
