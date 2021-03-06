const express = require('express');
const {
  createPosting,
  getPosting,
  getPostings,
  updatePosting,
  deletePosting,
  queryPostings,
} = require('../controllers/postings');

const router = express({ mergeParams: true });

const { protect, authorize, authorizePosting } = require('../middleware/auth');
router.route('/query/:encodedQueryString').get(queryPostings);
router.route('/').get(getPostings).post(createPosting);

// .get(getPostings)
// .post(
//   protect,
//   authorize('admin'),
//   authorizePosting('posting_creator'),
//   createPosting
// );

router
  .route('/:posting_id')
  .put(
    protect,
    authorizePosting('posting_creator', 'posting_editor'),
    updatePosting
  )
  .get(getPosting)
  .delete(
    protect,
    authorize('admin'),
    authorizePosting('posting_creator'),
    deletePosting
  );

module.exports = router;
