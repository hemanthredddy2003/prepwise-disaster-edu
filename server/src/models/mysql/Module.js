const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Module = sequelize.define('Module', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_id:    { type: DataTypes.INTEGER, allowNull: false },
  title:        { type: DataTypes.STRING(200), allowNull: false },
  content:      { type: DataTypes.TEXT, allowNull: true },
  video_url:    { type: DataTypes.STRING(255), allowNull: true },
  duration_mins:{ type: DataTypes.INTEGER, defaultValue: 10 },
  order_num:    { type: DataTypes.INTEGER, defaultValue: 1 },
  is_active:    { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'modules',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Module;
