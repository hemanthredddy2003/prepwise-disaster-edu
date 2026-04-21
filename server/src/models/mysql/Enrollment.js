const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Enrollment = sequelize.define('Enrollment', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:     { type: DataTypes.INTEGER, allowNull: false },
  course_id:   { type: DataTypes.INTEGER, allowNull: false },
  enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'enrollments',
  timestamps: false,
});

module.exports = Enrollment;
