const { EmergencyKit } = require('../models/mysql/index');
const { sendSuccess, sendError } = require('../utils/response');

const DEFAULT_ITEMS = [
  { item_name: 'Water (1 gallon per person per day)',  category: 'Water',     quantity: 3,  is_default: true },
  { item_name: 'Non-perishable food (3-day supply)',   category: 'Food',      quantity: 1,  is_default: true },
  { item_name: 'First Aid Kit',                        category: 'Medical',   quantity: 1,  is_default: true },
  { item_name: 'Flashlight with extra batteries',      category: 'Tools',     quantity: 1,  is_default: true },
  { item_name: 'Battery-powered radio',                category: 'Tools',     quantity: 1,  is_default: true },
  { item_name: 'Whistle (to signal for help)',         category: 'Safety',    quantity: 1,  is_default: true },
  { item_name: 'Dust masks (N95)',                     category: 'Medical',   quantity: 5,  is_default: true },
  { item_name: 'Plastic sheeting and duct tape',       category: 'Shelter',   quantity: 1,  is_default: true },
  { item_name: 'Moist towelettes & garbage bags',      category: 'Sanitation',quantity: 10, is_default: true },
  { item_name: 'Wrench or pliers',                     category: 'Tools',     quantity: 1,  is_default: true },
  { item_name: 'Manual can opener',                    category: 'Tools',     quantity: 1,  is_default: true },
  { item_name: 'Local maps',                           category: 'Navigation',quantity: 1,  is_default: true },
  { item_name: 'Cell phone with chargers & backup',    category: 'Comms',     quantity: 1,  is_default: true },
  { item_name: 'Important documents (copies)',         category: 'Documents', quantity: 1,  is_default: true },
  { item_name: 'Cash in small bills',                  category: 'Finance',   quantity: 1,  is_default: true },
];

const getMyKit = async (req, res) => {
  try {
    let items = await EmergencyKit.findAll({ where: { user_id: req.user.id }, order: [['category', 'ASC']] });
    if (items.length === 0) {
      // Seed default items for new user
      const defaults = DEFAULT_ITEMS.map(i => ({ ...i, user_id: req.user.id, is_checked: false }));
      items = await EmergencyKit.bulkCreate(defaults);
    }
    return sendSuccess(res, { items });
  } catch (err) { return sendError(res, err.message); }
};

const toggleItem = async (req, res) => {
  try {
    const item = await EmergencyKit.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return sendError(res, 'Item not found.', 404);
    await item.update({ is_checked: !item.is_checked });
    return sendSuccess(res, { item }, 'Item updated!');
  } catch (err) { return sendError(res, err.message); }
};

const addItem = async (req, res) => {
  try {
    const { item_name, category, quantity } = req.body;
    if (!item_name) return sendError(res, 'Item name is required.', 400);
    const item = await EmergencyKit.create({ user_id: req.user.id, item_name, category: category || 'Other', quantity: quantity || 1 });
    return sendSuccess(res, { item }, 'Item added!', 201);
  } catch (err) { return sendError(res, err.message); }
};

const deleteItem = async (req, res) => {
  try {
    const item = await EmergencyKit.findOne({ where: { id: req.params.id, user_id: req.user.id } });
    if (!item) return sendError(res, 'Item not found.', 404);
    await item.destroy();
    return sendSuccess(res, {}, 'Item removed!');
  } catch (err) { return sendError(res, err.message); }
};

module.exports = { getMyKit, toggleItem, addItem, deleteItem };
