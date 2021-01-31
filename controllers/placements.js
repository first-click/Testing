const { sequelize } = require('../database/models');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const PersonPosition = sequelize.models.person_position;

//@desc Get all placements
//@route GET /api/v1/placements
//@access Private/Admin
exports.getPersonsPositions = asyncHandler(async (req, res) => {
  const { company_id } = req.user;
  const edges = await PersonPosition.findAll(
    // { include: 'person' }
    {
      // where: {
      //   company_id,
      // },
    }
  );
  res.status(200).json({
    success: true,
    data: edges,
  });
});

//@desc Get a single placement
//@route GET /api/v1/placements
//@access Private/Admin
exports.getPersonPosition = asyncHandler(async (req, res) => {
  const { company_id } = req.user;
  const person_id = parseInt(req.params.person_id);
  const position_id = parseInt(req.params.position_id);
  console.log(person_id, position_id);
  // const { position_id, person_id } = req.params;
  const edge = await PersonPosition.findOne({
    where: {
      person_id,
      position_id,
    },
    include: ['person', 'position'],
  });
  res.status(200).json({
    success: true,
    data: edge,
  });
});
