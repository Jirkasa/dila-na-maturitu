const path = require("path");
const express = require("express");
const verificationRouter = require("./routes/verification/verification.router");
const api = require("./routes/api");
const helmet = require("helmet");


// create new express app
const app = express();

// redirect www to non-www
app.set("trust proxy", true);
app.use((req, res, next) => {
    if (req.headers.host.slice(0, 4) === "www.") {
        var newHost = req.headers.host.slice(4);
        return res.redirect(301, req.protocol + "://" + newHost + req.originalUrl);
    }
    next();
});

// set various http headers for better security
app.use(helmet());
// parse body
app.use(express.json());
// set public directories
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'google-authentication-public')));
// set view engine (for google login page)
app.set('view engine', 'hbs');
// set views folder for view engine
app.set('views', path.join(__dirname, '..', 'views'));

// set cors for development mode
if (process.env.DEV_MODE === "true") {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
}

// use API routes
app.use('/v1', api);
// use routes for verification page
app.use(verificationRouter);

// serve frontend application
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Not Found middleware
app.use((req, res, next) => {
    res.status(404).json({ error: "Not found" });
});

module.exports = app;