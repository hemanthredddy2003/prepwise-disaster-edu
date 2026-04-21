const { Drill } = require('../models/mysql/index');
const { sendSuccess, sendError } = require('../utils/response');

const getAllDrills = async (req, res) => {
  try {
    const drills = await Drill.findAll({ order: [['date', 'ASC']] });
    return sendSuccess(res, { drills });
  } catch (err) { return sendError(res, err.message); }
};

const createDrill = async (req, res) => {
  try {
    const { type, date, building, participants, notes } = req.body;
    if (!type || !date || !building) return sendError(res, 'Type, date and building are required.', 400);
    const drill = await Drill.create({ type, date, building, participants: participants || 0, notes, created_by: req.user.id });
    return sendSuccess(res, { drill }, 'Drill scheduled!', 201);
  } catch (err) { return sendError(res, err.message); }
};

const updateDrill = async (req, res) => {
  try {
    const drill = await Drill.findByPk(req.params.id);
    if (!drill) return sendError(res, 'Drill not found.', 404);
    await drill.update(req.body);
    return sendSuccess(res, { drill }, 'Drill updated!');
  } catch (err) { return sendError(res, err.message); }
};

const deleteDrill = async (req, res) => {
  try {
    const drill = await Drill.findByPk(req.params.id);
    if (!drill) return sendError(res, 'Drill not found.', 404);
    await drill.destroy();
    return sendSuccess(res, {}, 'Drill deleted!');
  } catch (err) { return sendError(res, err.message); }
};

module.exports = { getAllDrills, createDrill, updateDrill, deleteDrill };
