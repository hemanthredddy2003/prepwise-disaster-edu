const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const authRoutes = require('./routes/auth.routes');
const alertRoutes = require('./routes/alert.routes');
const courseRoutes = require('./routes/course.routes');
const quizRoutes = require('./routes/quiz.routes');
const familyRoutes = require('./routes/family.routes');
const shelterRoutes = require('./routes/shelter.routes');
const drillRoutes = require('./routes/drill.routes');
const kitRoutes = require('./routes/kit.routes');
const chatRoutes = require('./routes/chat.routes');
const reportRoutes = require('./routes/report.routes');
const resourceRoutes = require('./routes/resource.routes');
const simulationRoutes = require('./routes/simulation.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const errorHandler = require('./middleware/error.middleware');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/progress', require('./routes/progress.routes'));
app.use('/api/courses', courseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/shelters', shelterRoutes);
app.use('/api/drills', drillRoutes);
app.use('/api/kit', kitRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is healthy' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// error handler
app.use(errorHandler);

// ✅ export the app instance
module.exports = app;
