const http = require("http");

require('dotenv').config();
const app = require('./app');
const ResetPasswordToken = require("./models/resetPasswordToken");
const User = require("./models/user.model");
const VerificationToken = require("./models/verificationToken.model");
const sequelize = require('./services/database');


const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

// SET RELATIONS
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

async function startServer() {
    try {
        await sequelize
        // .sync({ force: true });
        .sync();
        // await sequelize.drop();
    
        server.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`);
        });
    } catch(err) {
        console.log(err);
    }
}
  
startServer();