const { ShelterLocation } = require('../models/mysql/index');
const { sendSuccess, sendError } = require('../utils/response');

const getAllShelters = async (req, res) => {
  try {
    const { type } = req.query;
    const where = { is_active: true };
    if (type && type !== 'all') where.type = type;
    const shelters = await ShelterLocation.findAll({ where });
    return sendSuccess(res, { shelters });
  } catch (err) { return sendError(res, err.message); }
};

const createShelter = async (req, res) => {
  try {
    const { name, address, latitude, longitude, capacity, type, contact } = req.body;
    if (!name || !address) return sendError(res, 'Name and address are required.', 400);
    const shelter = await ShelterLocation.create({ name, address, latitude, longitude, capacity, type, contact });
    return sendSuccess(res, { shelter }, 'Shelter added!', 201);
  } catch (err) { return sendError(res, err.message); }
};

module.exports = { getAllShelters, createShelter };
