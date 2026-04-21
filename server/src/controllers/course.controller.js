const { Course, Module, Enrollment, Progress, Certificate, User } = require('../models/mysql/index');
const { sendSuccess, sendError } = require('../utils/response');
const { v4: uuidv4 } = require('uuid');

// GET /api/courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { is_active: true },
      include: [{ model: Module, as: 'modules', where: { is_active: true }, required: false }],
      order: [['created_at', 'DESC']],
    });

    // Attach enrollment + progress for the logged-in user
    let enrollmentMap = {};
    let progressMap = {};
    if (req.user) {
      const enrollments = await Enrollment.findAll({ where: { user_id: req.user.id } });
      enrollments.forEach(e => { enrollmentMap[e.course_id] = true; });

      const progRows = await Progress.findAll({ where: { user_id: req.user.id, completed: true } });
      progRows.forEach(p => {
        if (!progressMap[p.course_id]) progressMap[p.course_id] = 0;
        progressMap[p.course_id]++;
      });
    }

    const enriched = courses.map(c => {
      const total = (c.modules || []).length;
      const done = progressMap[c.id] || 0;
      const pct = total > 0 ? Math.round((done / total) * 100) : 0;
      return {
        ...c.toJSON(),
        enrolled: !!enrollmentMap[c.id],
        progress: pct,
        completed_modules: done,
        total_modules: total,
      };
    });

    return sendSuccess(res, { courses: enriched });
  } catch (err) {
    return sendError(res, err.message);
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: Module, as: 'modules', where: { is_active: true }, required: false, order: [['order_num', 'ASC']] }],
    });
    if (!course) return sendError(res, 'Course not found.', 404);

    let enrolled = false;
    let progress = [];
    if (req.user) {
      const enrollment = await Enrollment.findOne({ where: { user_id: req.user.id, course_id: course.id } });
      enrolled = !!enrollment;
      if (enrolled) {
        progress = await Progress.findAll({ where: { user_id: req.user.id, course_id: course.id } });
      }
    }
    return sendSuccess(res, { course, enrolled, progress });
  } catch (err) {
    return sendError(res, err.message);
  }
};

// POST /api/courses
const createCourse = async (req, res) => {
  try {
    const { title, description, level, category, duration_mins, has_certificate } = req.body;
    if (!title) return sendError(res, 'Title is required.', 400);
    const course = await Course.create({
      title, description, level, category,
      duration_mins: duration_mins || 0,
      has_certificate: has_certificate !== undefined ? has_certificate : true,
      created_by: req.user.id,
    });
    return sendSuccess(res, { course }, 'Course created!', 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

// POST /api/courses/:id/enroll
const enrollCourse = async (req, res) => {
  try {
    const existing = await Enrollment.findOne({ where: { user_id: req.user.id, course_id: req.params.id } });
    if (existing) return sendError(res, 'Already enrolled.', 409);
    const enrollment = await Enrollment.create({ user_id: req.user.id, course_id: req.params.id });
    return sendSuccess(res, { enrollment }, 'Enrolled successfully!', 201);
  } catch (err) {
    return sendError(res, err.message);
  }
};

// POST /api/courses/modules/:moduleId/complete
const completeModule = async (req, res) => {
  try {
    const module = await Module.findByPk(req.params.moduleId);
    if (!module) return sendError(res, 'Module not found.', 404);

    const [progress, created] = await Progress.findOrCreate({
      where: { user_id: req.user.id, module_id: module.id, course_id: module.course_id },
      defaults: { completed: true, completed_at: new Date() },
    });

    if (!created && !progress.completed) {
      await progress.update({ completed: true, completed_at: new Date() });
    }

    const allModules = await Module.findAll({ where: { course_id: module.course_id, is_active: true } });
    const completedCount = await Progress.count({
      where: { user_id: req.user.id, course_id: module.course_id, completed: true }
    });

    let certificate = null;
    if (completedCount >= allModules.length) {
      const course = await Course.findByPk(module.course_id);
      if (course && course.has_certificate) {
        const [cert] = await Certificate.findOrCreate({
          where: { user_id: req.user.id, course_id: module.course_id },
          defaults: { score: 100, cert_code: `PREP-${uuidv4().substring(0,8).toUpperCase()}`, issued_at: new Date() },
        });
        certificate = cert;
      }
    }

    return sendSuccess(res, { progress, certificate, completedCount, total: allModules.length }, 'Module completed!');
  } catch (err) {
    return sendError(res, err.message);
  }
};

// GET /api/courses/my-courses
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await Enrollment.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Course, as: 'course',
        include: [{ model: Module, as: 'modules', where: { is_active: true }, required: false }]
      }]
    });

    const coursesWithProgress = await Promise.all(enrollments.map(async (e) => {
      const completed = await Progress.count({ where: { user_id: req.user.id, course_id: e.course_id, completed: true } });
      const total = e.course?.modules?.length || 0;
      const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
      const cert = await Certificate.findOne({ where: { user_id: req.user.id, course_id: e.course_id } });
      return {
        ...e.course.toJSON(),
        enrolled: true,
        completed_modules: completed,
        total_modules: total,
        progress: pct,
        status: pct >= 100 ? 'completed' : completed > 0 ? 'in_progress' : 'enrolled',
        enrolled_at: e.enrolled_at,
        cert_code: cert?.cert_code || null,
        score: cert?.score || null,
        issued_at: cert?.issued_at || null,
      };
    }));

    return sendSuccess(res, { courses: coursesWithProgress });
  } catch (err) {
    return sendError(res, err.message);
  }
};

// GET /api/courses/certificates  - user's earned certificates
const getMyCertificates = async (req, res) => {
  try {
    const certs = await Certificate.findAll({
      where: { user_id: req.user.id },
      include: [{ model: Course, as: 'course' }],
      order: [['issued_at', 'DESC']],
    });
    return sendSuccess(res, { certificates: certs });
  } catch (err) {
    return sendError(res, err.message);
  }
};

module.exports = { getAllCourses, getCourseById, createCourse, enrollCourse, completeModule, getMyCourses, getMyCertificates };