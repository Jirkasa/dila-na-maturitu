const http = require("http");

require('dotenv').config();
const app = require('./app');
const sequelize = require('./services/database');


const PORT = process.env.PORT || 8000;
const server = http.createServer(app);

async function startServer() {
    try {
        await sequelize
        // .sync({ force: true });
        .sync();
    
        server.listen(PORT, () => {
            console.log(`Listening on port ${PORT}...`);
        });
    } catch(err) {
        console.log(err);
    }
}
  
startServer();