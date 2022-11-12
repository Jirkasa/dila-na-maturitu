const Sequelize = require('sequelize');

// create Sequelize instance
let sequelize;
if (process.env.USE_POSTGRESS !== "true") {
    sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
        dialect: "mysql",
        host: process.env.DATABASE_HOST
    });
} else {
    // previously, Postgress database was used on heroku, but it is no longer free
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