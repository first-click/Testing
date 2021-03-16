const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = sequelize.models.user;
const Position = sequelize.models.position;
const Panel = sequelize.models.panel;
const Panel_Stakeholder = sequelize.models.panel_stakeholder;
const PanelItem = sequelize.models.panel_item;
const Panel_PanelItem = sequelize.models.panel_panel_item;
const PanelResult = sequelize.models.panel_result;

//@desc Get all panels
//@route GET /api/v1/panels/
//@access Private/Admin
exports.getPanels = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;

  // Make sure position is in scope of user's company
  // const panels = await Panel.findAll({
  //   where: { company_id: company_id },
  //   include: [Position, Panel_Stakeholder],
  // });

  // const panels = await Panel.findAll({
  //   where: { company_id: company_id },
  //   include: [Position, Panel_Stakeholder],
  // });

  const panels = await Panel_Stakeholder.findAll({
    where: { user_id: user_id },
    include: { model: Panel, include: Position },
    // order: [['created_at', 'ASC']],
    order: [[{ model: Panel, as: 'Panel' }, 'created_at', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: panels,
  });
});

//@desc Create a new panel
//@route POST /api/v1/panels/:position_id
//@access Private/Admin
exports.createPanel = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { position_id } = req.params;

  // Make sure position is in scope of user's company
  const position = await Position.findByPk(position_id);
  if (position.company_id !== company_id) {
    return next(new ErrorResponse('Position does not exist in company', 400));
  }

  const panel = await Panel.create({
    company_id,
    creator_id: user_id, // Creator is the logged in user
    position_id,
    status: 'planning',
  });

  // Add creator as first stakeholder with master role
  const stakeholder = await Panel_Stakeholder.create({
    panel_id: panel.panel_id,
    user_id,
    panel_role: 'master',
  });

  res.status(200).json({
    success: true,
    data: { ...panel.dataValues, position, panel_stakeholders: [stakeholder] },
  });
});

//@desc Add a new stakeholder to panel
//@route POST /api/v1/panels/:panel_id/stakeholders
//@access Private/Admin
// A stakeholder is somebody with role "master", "interviewer", "council", or "applicant"
exports.addStakeholderToPanel = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { new_stakeholder_id, panel_role } = req.body;
  const panel = await Panel.findByPk(req.params.panel_id);
  const new_stakeholder = await User.findByPk(new_stakeholder_id);
  const current_stakeholders = await Panel_Stakeholder.findAll({
    where: { panel_id: panel.panel_id },
  });

  // prüfen, ob der User, der den Post Request ausführt, berechtigt ist
  if (
    !current_stakeholders.some((stakeholder) => {
      // console.log(stakeholder);
      return (
        user_id === stakeholder.user_id && // user ist stakeholder
        stakeholder.panel_role === 'master' // user ist master
      );
    })
  ) {
    return next(new ErrorResponse('Not authorized to do that', 401));
  }

  // prüfen, ob new_stakeholder im Scope des Panels ist
  // Lösung zunächst vereinfacht
  // Todo: Panel-TN kann nur werden, wer sich gelistet hat
  // Braucht Positions of Interest Model
  if (
    new_stakeholder.company_id !== company_id &&
    new_stakeholder.company_id !== null
  ) {
    return next(
      new ErrorResponse('The person you want to add is not in scope', 401)
    );
  }

  const new_stakeholder_created = await Panel_Stakeholder.create({
    panel_id: panel.panel_id,
    user_id: new_stakeholder.user_id,
    panel_role,
  });

  res.status(200).json({
    success: true,
    data: new_stakeholder_created,
  });
});

//@desc Create a new panel item
//@route POST /api/v1/panels/panel_item
//@access Private/Admin
exports.createPanelItem = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { name, description, scale } = req.body;
  // const { position_id } = req.params;

  let type = 'number';
  if (scale === 'text') type = 'string';

  const panel_item = await PanelItem.create({
    company_id,
    creator_id: user_id, // Creator is the logged in user
    name,
    description, // optional
    scale, // "text", "2", "3", "4", "5", "6", "7"
    type, // "string", "number"
  });

  res.status(200).json({
    success: true,
    data: panel_item,
  });
});

//@desc Get panel items
//@route GET /api/v1/panels/panel_items
//@access Private/Admin
exports.getPanelItems = asyncHandler(async (req, res, next) => {
  console.log('getPanelItems', req.user);
  const { company_id, user_id } = req.user;
  // const { position_id } = req.params;

  const panel_items = await PanelItem.findAll({
    where: { company_id },
  });

  res.status(200).json({
    success: true,
    data: panel_items,
  });
});

//@desc Link panel item to panel
//@route POST /api/v1/panels/:panel_id/panel_item/
//@access Private/Admin
exports.addPanelItemToPanel = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { panel_id } = req.params;
  const { panel_item_id } = req.body;

  const panel = await Panel.findByPk(panel_id);
  const panel_item = await PanelItem.findByPk(panel_item_id);
  console.log(panel_item);

  if (panel.status !== 'planning') {
    return next(
      new ErrorResponse(
        'You can not change the panel anymore. Planning phase is over',
        401
      )
    );
  }

  const added_panel_item = await Panel_PanelItem.create({
    panel_id,
    panel_item_id: panel_item.panel_item_id,
    name: panel_item.name,
    description: panel_item.description,
    scale: panel_item.scale,
    type: panel_item.type,
  });

  res.status(200).json({
    success: true,
    data: added_panel_item,
  });
});

//@desc Add result
//@route POST /api/v1/panels/:panel_id/result/
//@access Private/Admin
exports.addResult = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { panel_id } = req.params;
  const { panel_panel_item_id, applicant_id, value, comment } = req.body;
  const panel_panel_item = await Panel_PanelItem.findByPk(panel_panel_item_id);
  const { scale, type } = panel_panel_item;

  let value_number, value_string;
  if (type === 'number') {
    value_number = parseInt(value);
    value_string = null;
    if (value_number < 1 || value_number > parseInt(scale)) {
      return next(new ErrorResponse('Invalid rating', 400));
    }
  }
  if (type === 'string') {
    value_number = null;
    value_string = value;
  }
  console.log(value_number, value_string, type);
  // if (panel.status !== 'ongoing') {
  //   return next(
  //     new ErrorResponse(
  //       'You can not add results anymore. Ongoing phase is over',
  //       401
  //     )
  //   );
  // }

  const panel_result = await PanelResult.create({
    panel_id,
    interviewer_id: user_id,
    applicant_id,
    panel_panel_item_id,
    scale,
    type,
    value_number,
    value_string,
    comment,
  });

  res.status(200).json({
    success: true,
    data: panel_result,
  });
});
