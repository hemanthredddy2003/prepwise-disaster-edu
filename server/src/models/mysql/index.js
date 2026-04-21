const User            = require('./User');
const Course          = require('./Course');
const Module          = require('./Module');
const Enrollment      = require('./Enrollment');
const Progress        = require('./Progress');
const Certificate     = require('./Certificate');
const Alert           = require('./Alert');
const Drill           = require('./Drill');
const Resource        = require('./Resource');
const ShelterLocation = require('./ShelterLocation');
const EmergencyKit    = require('./EmergencyKit');
const DisasterReport  = require('./DisasterReport');

// Course associations
Course.hasMany(Module,      { foreignKey: 'course_id', as: 'modules' });
Module.belongsTo(Course,   { foreignKey: 'course_id', as: 'course' });

Course.hasMany(Enrollment,  { foreignKey: 'course_id', as: 'enrollments' });
Enrollment.belongsTo(Course,{ foreignKey: 'course_id', as: 'course' });

User.hasMany(Enrollment,    { foreignKey: 'user_id', as: 'enrollments' });
Enrollment.belongsTo(User,  { foreignKey: 'user_id', as: 'user' });

User.hasMany(Progress,      { foreignKey: 'user_id', as: 'progress' });
Progress.belongsTo(User,    { foreignKey: 'user_id', as: 'user' });

Module.hasMany(Progress,    { foreignKey: 'module_id', as: 'progress' });
Progress.belongsTo(Module,  { foreignKey: 'module_id', as: 'module' });

User.hasMany(Certificate,   { foreignKey: 'user_id', as: 'certificates' });
Certificate.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

Course.hasMany(Certificate, { foreignKey: 'course_id', as: 'certificates' });
Certificate.belongsTo(Course,{ foreignKey: 'course_id', as: 'course' });

User.hasMany(DisasterReport, { foreignKey: 'user_id', as: 'reports' });
DisasterReport.belongsTo(User,{ foreignKey: 'user_id', as: 'user' });

User.hasMany(EmergencyKit,  { foreignKey: 'user_id', as: 'kit_items' });
EmergencyKit.belongsTo(User,{ foreignKey: 'user_id', as: 'user' });

module.exports = {
  User, Course, Module, Enrollment, Progress,
  Certificate, Alert, Drill, Resource,
  ShelterLocation, EmergencyKit, DisasterReport,
};
