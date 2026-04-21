const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Resource = sequelize.define('Resource', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:       { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  file_type:   { type: DataTypes.STRING(20), allowNull: true },
  file_path:   { type: DataTypes.STRING(255), allowNull: true },
  category:    { type: DataTypes.STRING(100), allowNull: true },
  icon:        { type: DataTypes.STRING(10), defaultValue: '📄' },
  uploaded_by: { type: DataTypes.INTEGER, allowNull: true },
  is_active:   { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'resources',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Resource;
