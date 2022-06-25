const express = require('express');
const authRouter = require('./auth/auth.router');
const usersRouter = require('./users/users.router');
const materialsRouter = require('./materials/materials.router');

const api = express.Router();

api.use("/auth", authRouter);
api.use("/users", usersRouter);
api.use("/materials", materialsRouter);

module.exports = api;