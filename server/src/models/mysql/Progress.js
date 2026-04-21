const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Progress = sequelize.define('Progress', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:      { type: DataTypes.INTEGER, allowNull: false },
  module_id:    { type: DataTypes.INTEGER, allowNull: false },
  course_id:    { type: DataTypes.INTEGER, allowNull: false },
  completed:    { type: DataTypes.BOOLEAN, defaultValue: false },
  completed_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: 'progress',
  timestamps: false,
});

module.exports = Progress;
