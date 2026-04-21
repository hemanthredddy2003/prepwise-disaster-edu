require('dotenv').config();
const app = require('./app');
const { connectMySQL } = require('./config/mysql');
const { connectMongoDB } = require('./config/mongodb');

const PORT = process.env.PORT || 5001;

async function startServer() {
  try {
    await connectMySQL();
    await connectMongoDB();

    // Seed data on first run
    const seedData = require('../database/seeds/courses.seed');
    await seedData();

    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('❌ Failed to start server:', err.message);
    process.exit(1);
  }
}

startServer();
