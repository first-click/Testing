const express = require('express');
const {
  createPosting,
  getPosting,
  getPostings,
  updatePosting,
  deletePosting,
} = require('../controllers/postings');

const router = express({ mergeParams: true });

const { protect, authorize, authorizePosting } = require('../middleware/auth');

router
  .route('/')
  .get(getPostings)
  .post(authorizePosting('posting_creator'), createPosting);

router
  .route('/:posting_id')
  .put(authorizePosting('posting_creator', 'posting_editor'), updatePosting)
  .get(getPosting)
  .delete(authorizePosting('posting_creator'), deletePosting);

module.exports = router;
