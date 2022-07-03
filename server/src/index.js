const http = require("http");
require('dotenv').config();
const app = require('./app');
const Like = require("./models/like.model");
const Material = require("./models/material.model");
const ResetPasswordToken = require("./models/resetPasswordToken.model");
const SurveyVote = require("./models/surveyVote.model");
const User = require("./models/user.model");
const VerificationToken = require("./models/verificationToken.model");
const sequelize = require('./services/database');


// create server
const PORT = process.env.PORT || 8000;
// const server = http.createServer(app);

// -------------- SET RELATIONS -----------------
User.hasOne(VerificationToken, {
    onDelete: "CASCADE",
    foreignKey: {
        allowNull: false
    }
});
User.hasOne(ResetPasswordToken, {
    onDelete: "CASCADE",
    foreignKey: {
        allowNull: false
    }
});
User.hasMany(Material, {
    onDelete: "CASCADE",
    foreignKey: 'materialAuthorId'
});
Material.belongsTo(User, {
    foreignKey: "materialAuthorId"
});
User.belongsToMany(Material, { through: Like });
Material.belongsToMany(User, { through: Like });
User.hasOne(SurveyVote, {
    onDelete: "CASCADE",
    foreignKey: {
        allowNull: false,
        primaryKey: true
    }
})
// ------------------------------------------------

// function to start server
async function startServer() {
    try {
        // sync sequelize
        await sequelize
        .sync();
        // .sync({ force: true }); // NOTE - call sync with force argument when something is changed in models or relations
    
        // start server
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`);
        });
    } catch(err) {
        console.log(err);
    }
}

startServer();