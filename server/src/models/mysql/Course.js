const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Course = sequelize.define('Course', {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title:           { type: DataTypes.STRING(200), allowNull: false },
  description:     { type: DataTypes.TEXT, allowNull: true },
  level:           { type: DataTypes.ENUM('beginner','intermediate','advanced'), defaultValue: 'beginner' },
  category:        { type: DataTypes.STRING(100), allowNull: true },
  duration_mins:   { type: DataTypes.INTEGER, defaultValue: 0 },
  has_certificate: { type: DataTypes.BOOLEAN, defaultValue: true },
  thumbnail:       { type: DataTypes.STRING(255), allowNull: true },
  is_active:       { type: DataTypes.BOOLEAN, defaultValue: true },
  created_by:      { type: DataTypes.INTEGER, allowNull: true },
}, {
  tableName: 'courses',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Course;
