const express = require('express');
const {
  createPosting,
  getPosting,
  getPostings,
  updatePosting,
  deletePosting,
} = require('../controllers/postings');

const router = express({ mergeParams: true });

const { protect, authorize } = require('../middleware/auth');

router.route('/').get(getPostings).post(createPosting);

router
  .route('/:posting_id')
  .put(updatePosting)
  .get(getPosting)
  .delete(deletePosting);

module.exports = router;
