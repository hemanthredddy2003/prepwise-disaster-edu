const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const DisasterReport = sequelize.define('DisasterReport', {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:       { type: DataTypes.INTEGER, allowNull: false },
  disaster_type: { type: DataTypes.STRING(100), allowNull: false },
  location:      { type: DataTypes.STRING(300), allowNull: false },
  description:   { type: DataTypes.TEXT, allowNull: false },
  severity:      { type: DataTypes.ENUM('low','medium','high','critical'), defaultValue: 'medium' },
  status:        { type: DataTypes.ENUM('pending','reviewing','resolved'), defaultValue: 'pending' },
  latitude:      { type: DataTypes.FLOAT, allowNull: true },
  longitude:     { type: DataTypes.FLOAT, allowNull: true },
  image_path:    { type: DataTypes.STRING(255), allowNull: true },
}, {
  tableName: 'disaster_reports',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = DisasterReport;
