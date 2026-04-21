const { Alert } = require('../models/mysql/index');
const { sendSuccess, sendError } = require('../utils/response');

const getAllAlerts = async (req, res) => {
  try {
    const alerts = await Alert.findAll({ order: [['created_at', 'DESC']] });
    return sendSuccess(res, { alerts });
  } catch (err) { return sendError(res, err.message); }
};

const createAlert = async (req, res) => {
  try {
    const { title, level, message, target_group } = req.body;
    if (!title || !message) return sendError(res, 'Title and message are required.', 400);
    const alert = await Alert.create({ title, level: level || 'info', message, target_group: target_group || 'all', sent_by: req.user.id });
    return sendSuccess(res, { alert }, 'Alert broadcast!', 201);
  } catch (err) { return sendError(res, err.message); }
};

const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) return sendError(res, 'Alert not found.', 404);
    await alert.update({ is_active: false });
    return sendSuccess(res, { alert }, 'Alert resolved!');
  } catch (err) { return sendError(res, err.message); }
};

const deleteAlert = async (req, res) => {
  try {
    const alert = await Alert.findByPk(req.params.id);
    if (!alert) return sendError(res, 'Alert not found.', 404);
    await alert.destroy();
    return sendSuccess(res, {}, 'Alert deleted!');
  } catch (err) { return sendError(res, err.message); }
};

module.exports = { getAllAlerts, createAlert, resolveAlert, deleteAlert };
