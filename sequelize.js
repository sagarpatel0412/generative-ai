/* eslint-disable no-undef */
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database:process.env.DB_NAME,
  logging: console.log,
});

module.exports = { sequelize };
