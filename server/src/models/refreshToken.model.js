const Sequelize = require('sequelize');

const sequelize = require('../services/database');

// TODO - sequelize tam automaticky přidává createdAt, takže expiration date tam zadávat nemusím
// TODO - takže později ale asi udělat nějakou CRON job - pokud se tomu tak říká, která vyháže nepoužité refresh tokeny
const RefreshToken = sequelize.define("refreshtoken", {
    token: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
    }
}, {
    indexes: [ // tokens are indexed, so they can be quickly obtained from database
        {
            fields: ["token"]
        }
    ]
});

module.exports = RefreshToken;