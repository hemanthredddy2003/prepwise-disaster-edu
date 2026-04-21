const { DataTypes } = require('sequelize');
const { sequelize } = require('../../config/mysql');

const Certificate = sequelize.define('Certificate', {
  id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id:   { type: DataTypes.INTEGER, allowNull: false },
  course_id: { type: DataTypes.INTEGER, allowNull: false },
  score:     { type: DataTypes.FLOAT, defaultValue: 0 },
  cert_code: { type: DataTypes.STRING(50), unique: true },
  issued_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: 'certificates',
  timestamps: false,
});

module.exports = Certificate;
