const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const ShelterLocation = sequelize.define('ShelterLocation', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name:      { type: DataTypes.STRING(200), allowNull: false },
  address:   { type: DataTypes.STRING(300), allowNull: false },
  latitude:  { type: DataTypes.FLOAT, allowNull: true },
  longitude: { type: DataTypes.FLOAT, allowNull: true },
  capacity:  { type: DataTypes.INTEGER, defaultValue: 0 },
  type:      { type: DataTypes.ENUM('flood','fire','earthquake','cyclone','general'), defaultValue: 'general' },
  contact:   { type: DataTypes.STRING(100), allowNull: true },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
}, {
  tableName: 'shelter_locations',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = ShelterLocation;
