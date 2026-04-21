const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const EmergencyKit = sequelize.define('EmergencyKit', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:     { type: DataTypes.INTEGER, allowNull: false },
  item_name:   { type: DataTypes.STRING(200), allowNull: false },
  category:    { type: DataTypes.STRING(100), allowNull: true },
  quantity:    { type: DataTypes.INTEGER, defaultValue: 1 },
  is_checked:  { type: DataTypes.BOOLEAN, defaultValue: false },
  is_default:  { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  tableName: 'emergency_kits',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = EmergencyKit;
