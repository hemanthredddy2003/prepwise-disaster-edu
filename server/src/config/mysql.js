const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USER,
  process.env.MYSQL_PASSWORD,
  {
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT || 3306,
    dialect: 'mysql',
    logging: false,
  }
);

const connectMySQL = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL connected');
    await sequelize.sync({ alter: false });
    console.log('✅ MySQL models synced');
  } catch (err) {
    console.error('❌ MySQL connection failed:', err.message);
    throw err;
  }
};

module.exports = { sequelize, connectMySQL };
