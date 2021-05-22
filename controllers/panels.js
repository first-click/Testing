const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = sequelize.models.user;
const Position = sequelize.models.position;
const Person = sequelize.models.person;
const Panel = sequelize.models.panel;
const Panel_Stakeholder = sequelize.models.panel_stakeholder;
const Scale = sequelize.models.scale;
const Panel_Scale = sequelize.models.panel_scale;
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

//@desc Get a single panel
//@route GET /api/v1/panels/:panel_id
//@access Private/Admin
exports.getPanel = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { panel_id } = req.params;

  const panel = await Panel.findByPk(panel_id, {
    include: [
      { model: Position },
      {
        model: Panel_Stakeholder,
        // attributes: ['panel_role'],
        include: {
          model: User,
          attributes: ['username', 'user_id', 'avatar'],
          include: {
            model: Person,
            attributes: ['person_first_name', 'person_last_name', 'person_id'],
            include: {
              model: Position,
            },
          },
        },
      },
      { model: Panel_Scale },
    ],
  });

  res.status(200).json({
    success: true,
    data: panel,
  });
});

//@desc Get all stakeholders
//@route GET /api/v1/panels/:panel_id/stakeholder
//@access Private/Admin
exports.getPanelStakeholders = asyncHandler(async (req, res, next) => {
  const { panel_id } = req.params;
  const { company_id, user_id } = req.user;

  const stakeholders = await Panel_Stakeholder.findAll({
    where: { panel_id },
    // include: { model: Panel, include: Position },
    // order: [['created_at', 'ASC']],
    // order: [[{ model: Panel, as: 'Panel' }, 'created_at', 'ASC']],
  });

  res.status(200).json({
    success: true,
    data: stakeholders,
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
    data: {
      ...stakeholder.dataValues,
      panel: { ...panel.dataValues, position },
    },
    // data: { ...panel.dataValues, position, panel_stakeholders: [stakeholder] },
  });
});

//@desc Delete a panel
//@route DELETE /api/v1/panels/:panel_id
//@access Private/Admin
exports.deletePanel = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { panel_id } = req.params;

  const count = await Panel.destroy({
    where: { panel_id },
  });

  if (count === 0) return next(new ErrorResponse('Something went wrong', 400));

  res.status(200).json({
    success: true,
    data: { panel_id },
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

  const new_stakeholder_enriched = await Panel_Stakeholder.findAll({
    where: {
      panel_id: new_stakeholder_created.panel_id,
      user_id: new_stakeholder_created.user_id,
    },
    include: {
      model: User,
      attributes: ['username', 'user_id', 'avatar'],
      include: {
        model: Person,
        attributes: ['person_first_name', 'person_last_name', 'person_id'],
        include: {
          model: Position,
        },
      },
    },
  });

  res.status(200).json({
    success: true,
    data: new_stakeholder_enriched[0],
    // data: new_stakeholder_created,
  });
});

//@desc Delete a stakeholder from panel
//@route DELETE /api/v1/panels/:panel_id/stakeholders/:stakeholder_id
//@access Private/Admin
exports.deleteStakeholderFromPanel = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { stakeholder_id } = req.params;
  const panel = await Panel.findByPk(req.params.panel_id);

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

  const deleteCount = await Panel_Stakeholder.destroy({
    where: {
      panel_id: panel.panel_id,
      user_id: stakeholder_id,
    },
  });

  res.status(200).json({
    success: true,
    data: deleteCount,
  });
});

//@desc Create a new scale
//@route POST /api/v1/panels/scale
//@access Private/Admin
exports.createScale = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { title, description, base, length, fields, anchors } = req.body;

  const scale = await Scale.create({
    company_id,
    creator_id: user_id, // Creator is the logged in user
    editor_id: user_id, // Initial editor is the logged in user
    title,
    description, //optional
    base,
    length,
    fields,
    anchors,
  });

  res.status(200).json({
    success: true,
    data: scale,
  });
});

//@desc Update a scale
//@route PUT /api/v1/panels/scale/:scale_id
//@access Private/Admin
exports.updateScale = asyncHandler(async (req, res, next) => {
  const { scale_id } = req.params;
  const { user_id } = req.user;
  const { title, description, base, length, fields, anchors } = req.body;

  const scale = await Scale.update(
    {
      editor_id: user_id, // Editor is the logged in user
      title,
      description, //optional
      base,
      length,
      fields,
      anchors,
    },
    { where: { scale_id }, returning: true, plain: true }
  );

  res.status(200).json({
    success: true,
    data: scale[1],
  });
});

//@desc Delete a scale
//@route DELETE /api/v1/panels/scale/:scale_id
//@access Private/Admin
exports.deleteScale = asyncHandler(async (req, res, next) => {
  const { scale_id } = req.params;

  const scale = await Scale.destroy({ where: { scale_id } });

  res.status(200).json({
    success: true,
    data: scale,
  });
});

//@desc Get panel items
//@route GET /api/v1/panels/scales
//@access Private/Admin
exports.getScales = asyncHandler(async (req, res, next) => {
  // console.log('getScales', req.user);
  const { company_id, user_id } = req.user;
  // const { position_id } = req.params;

  const scales = await Scale.findAll({
    where: { company_id },
  });

  res.status(200).json({
    success: true,
    data: scales,
  });
});

//@desc Add scale to panel
//@route POST /api/v1/panels/:panel_id/scale/
//@access Private/Admin
exports.addScaleToPanel = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { panel_id } = req.params;
  const { scale_id } = req.body;

  const panel = await Panel.findByPk(panel_id);
  const scale = await Scale.findByPk(scale_id);
  // console.log(scale);

  if (panel.status !== 'planning') {
    return next(
      new ErrorResponse(
        'You can not change the panel anymore. Planning phase is over',
        401
      )
    );
  }

  const added_scale = await Panel_Scale.create({
    panel_id,
    company_id: scale.company_id,
    scale_id: scale.scale_id,
    title: scale.title,
    description: scale.description,
    type: scale.type,
    base: scale.base,
    length: scale.length,
    fields: scale.fields,
    anchors: scale.anchors,
    rank: '1000',
  });

  res.status(200).json({
    success: true,
    data: added_scale,
  });
});

//@desc Remove scale from panel
//@route DELETE /api/v1/panels/:panel_id/scale/
//@access Private/Admin
exports.deleteScaleFromPanel = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { panel_id } = req.params;
  const { scale_id, panel_scale_id } = req.body;

  let panel_scale;

  if (!!panel_scale_id) {
    panel_scale = await Panel_Scale.findAll({
      where: panel_scale_id,
      plain: true,
    });
  } else {
    panel_scale = await Panel_Scale.findAll({
      where: { panel_id, scale_id },
      plain: true,
    });
  }

  if (panel_scale.length === 0)
    return next(new ErrorResponse('Delete not successful', 400));

  await Panel_Scale.destroy({
    where: { panel_scale_id: panel_scale.panel_scale_id },
  });

  res.status(200).json({
    success: true,
    data: panel_scale,
  });
});

//@desc Add result
//@route POST /api/v1/panels/:panel_id/result/
//@access Private/Admin
exports.addResult = asyncHandler(async (req, res, next) => {
  const { company_id, user_id } = req.user;
  const { panel_id } = req.params;
  const { panel_scale_id, applicant_id, value, comment } = req.body;
  const panel_scale = await Panel_Scale.findByPk(panel_scale_id);
  const { scale, type } = panel_scale;

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
    panel_scale_id,
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
