const Sequelize = require('sequelize');

// create Sequelize instance
let sequelize;
if (process.env.DEV_MODE === "true") {
    // connect to MySQL database for development
    sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        dialect: process.env.DATABASE_DIALECT,
        host: process.env.DATABASE_HOST
    });
} else {
    // connect to Postgres database for production
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        dialect: "postgres",
        dialectOptions: {
          ssl: {
            require: true,
            rejectUnauthorized: false
          }
        }
      }
    );
}

module.exports = sequelize;