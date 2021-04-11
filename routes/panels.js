const express = require('express');
const {
  createPanel,
  getPanel,
  getPanels,
  addStakeholderToPanel,
  deleteStakeholderFromPanel,
  createPanelItem,
  getPanelItems,
  addPanelItemToPanel,
  addResult,
  getPanelStakeholders,
} = require('../controllers/panels');
const router = express({ mergeParams: true });
const { protect } = require('../middleware/auth');

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router.route('/').get(protect, getPanels);
router.route('/panel_item').post(protect, createPanelItem);
router.route('/panel_items').get(protect, getPanelItems);
router.route('/:panel_id/panel_item').post(protect, addPanelItemToPanel);
router.route('/:panel_id').get(protect, getPanel);
router.route('/:position_id').post(protect, createPanel);
router
  .route('/:panel_id/stakeholder')
  .get(protect, getPanelStakeholders)
  .post(protect, addStakeholderToPanel);
router
  .route('/:panel_id/stakeholder/:stakeholder_id')
  .delete(protect, deleteStakeholderFromPanel);
router.route('/:panel_id/result').post(protect, addResult);
// .post(protect, createPosition);

// router
//   .route('/:position_id')
//   .put(protect, updatePosition)
//   .get(protect, getPosition)
//   .delete(protect, deletePosition);

module.exports = router;
