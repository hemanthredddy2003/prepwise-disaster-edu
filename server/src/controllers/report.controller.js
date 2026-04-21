const { DisasterReport, User } = require('../models/mysql/index');
const { sendSuccess, sendError } = require('../utils/response');

const getAllReports = async (req, res) => {
  try {
    const reports = await DisasterReport.findAll({
      include: [{ model: User, as: 'user', attributes: ['id','name','email'] }],
      order: [['created_at', 'DESC']]
    });
    return sendSuccess(res, { reports });
  } catch (err) { return sendError(res, err.message); }
};

const createReport = async (req, res) => {
  try {
    const { disaster_type, location, description, severity, latitude, longitude } = req.body;
    if (!disaster_type || !location || !description) return sendError(res, 'Type, location and description are required.', 400);
    const report = await DisasterReport.create({
      user_id: req.user.id, disaster_type, location, description,
      severity: severity || 'medium', latitude, longitude,
      image_path: req.file ? req.file.path : null,
    });
    return sendSuccess(res, { report }, 'Report submitted!', 201);
  } catch (err) { return sendError(res, err.message); }
};

const updateReportStatus = async (req, res) => {
  try {
    const report = await DisasterReport.findByPk(req.params.id);
    if (!report) return sendError(res, 'Report not found.', 404);
    await report.update({ status: req.body.status });
    return sendSuccess(res, { report }, 'Status updated!');
  } catch (err) { return sendError(res, err.message); }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await DisasterReport.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    return sendSuccess(res, { reports });
  } catch (err) { return sendError(res, err.message); }
};

module.exports = { getAllReports, createReport, updateReportStatus, getMyReports };
