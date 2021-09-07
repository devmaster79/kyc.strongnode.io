const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  HOST: process.env.HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: parseInt(process.env.DB_POOL_MAX),
    min: parseInt(process.env.DB_POOL_MIN),
    acquire: process.env.DB_POOL_ACQUIRE,
    idle: process.env.DB_POOL_IDLE
  }
};
