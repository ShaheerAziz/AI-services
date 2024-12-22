const { Sequelize } = require('sequelize');
const dotenv = require('dotenv')
dotenv.config({ path: `${process.cwd()}/.env` });

const env = process.env.NODE_ENV || 'development';

const config = require('./config');

const sequelize = new Sequelize(config[env]);

module.exports = sequelize;