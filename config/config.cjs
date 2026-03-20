const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL, 
    dialect: 'postgres', // Use 'postgres' for Render
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};