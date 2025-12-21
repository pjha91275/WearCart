const { Sequelize } = require("sequelize");
require("dotenv").config();

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);


const sequelize = new Sequelize(
  process.env.DB_NAME,       // Supabase database name
  process.env.DB_USER,       // Supabase database user
  process.env.DB_PASSWORD,   // Supabase database password

  {
    host: process.env.DB_HOST,   // Supabase host
    port: process.env.DB_PORT || 5432,
    dialect: "postgres",
    dialectModule: require('pg'), // Required for Vercel/Next.js
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    dialectOptions: process.env.DB_SSL === 'true' ? {
      ssl: {
        require: true,
        rejectUnauthorized: false, // IMPORTANT for Supabase
      },
    } : {},
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

module.exports = sequelize;


