const Sequelize = require('sequelize');

// create Sequelize instance
const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: "mysql",
    host: process.env.DATABASE_HOST
});

module.exports = sequelize;