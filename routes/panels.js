const express = require('express');
const {
  createPanel,
  getPanel,
  getPanels,
  addStakeholderToPanel,
  deleteStakeholderFromPanel,
  createScale,
  getScales,
  addScaleToPanel,
  deleteScaleFromPanel,
  addResult,
  updateScale,
  deleteScale,
  getPanelStakeholders,
} = require('../controllers/panels');
const router = express({ mergeParams: true });
const { protect } = require('../middleware/auth');

// const { protect, authorize } = require('../middleware/auth');

// router.use(protect);
// router.use(authorize('admin'));

router.route('/').get(protect, getPanels);
router.route('/scale').post(protect, createScale);
router
  .route('/scale/:scale_id')
  .put(protect, updateScale)
  .delete(protect, deleteScale);
router.route('/scales').get(protect, getScales);
router
  .route('/:panel_id/scale')
  .post(protect, addScaleToPanel)
  .delete(protect, deleteScaleFromPanel);
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
