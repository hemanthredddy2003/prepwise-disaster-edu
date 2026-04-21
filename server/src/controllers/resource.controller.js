const { Resource } = require('../models/mysql/index');
const { sendSuccess, sendError } = require('../utils/response');

const getAllResources = async (req, res) => {
  try {
    const { category } = req.query;
    const where = { is_active: true };
    if (category && category !== 'All') where.category = category;
    const resources = await Resource.findAll({ where, order: [['created_at', 'DESC']] });
    return sendSuccess(res, { resources });
  } catch (err) { return sendError(res, err.message); }
};

const createResource = async (req, res) => {
  try {
    const { title, description, file_type, category, icon } = req.body;
    if (!title) return sendError(res, 'Title is required.', 400);
    const resource = await Resource.create({
      title, description, file_type, category, icon: icon || '📄',
      file_path: req.file ? req.file.path : null,
      uploaded_by: req.user.id,
    });
    return sendSuccess(res, { resource }, 'Resource added!', 201);
  } catch (err) { return sendError(res, err.message); }
};

const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findByPk(req.params.id);
    if (!resource) return sendError(res, 'Resource not found.', 404);
    await resource.update({ is_active: false });
    return sendSuccess(res, {}, 'Resource removed!');
  } catch (err) { return sendError(res, err.message); }
};

module.exports = { getAllResources, createResource, deleteResource };
