const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Drill = sequelize.define('Drill', {
  id:           { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type:         { type: DataTypes.STRING(100), allowNull: false },
  date:         { type: DataTypes.DATEONLY, allowNull: false },
  building:     { type: DataTypes.STRING(200), allowNull: false },
  participants: { type: DataTypes.INTEGER, defaultValue: 0 },
  status:       { type: DataTypes.ENUM('planned','scheduled','completed','cancelled'), defaultValue: 'scheduled' },
  notes:        { type: DataTypes.TEXT, allowNull: true },
  created_by:   { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'drills',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Drill;
