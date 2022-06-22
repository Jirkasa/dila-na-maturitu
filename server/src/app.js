const path = require("path");

const express = require("express");
const verificationRouter = require("./routes/verification/verification.router");
const api = require("./routes/api");

const app = express();


app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'google-authentication-public')));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '..', 'views'));

if (process.env.DEV_MODE === "true") {
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
		res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        next();
    });
}

app.use('/v1', api);
app.use(verificationRouter);

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.use((req, res, next) => {
    res.status(404).json({ error: "Not found" });
});

module.exports = app;