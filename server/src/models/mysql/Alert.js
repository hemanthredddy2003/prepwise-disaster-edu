const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Alert = sequelize.define('Alert', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:        { type: DataTypes.STRING(200), allowNull: false },
  level:        { type: DataTypes.ENUM('info','warning','critical'), defaultValue: 'info' },
  message:      { type: DataTypes.TEXT, allowNull: false },
  target_group: { type: DataTypes.STRING(50), defaultValue: 'all' },
  sent_by:      { type: DataTypes.INTEGER, allowNull: true },
  is_active:    { type: DataTypes.BOOLEAN, defaultValue: true },
  ai_summary:   { type: DataTypes.TEXT, allowNull: true },
}, {
  tableName: 'alerts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Alert;
