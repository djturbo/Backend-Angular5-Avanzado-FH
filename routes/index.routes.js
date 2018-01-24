'use strict';

const express = require('express');

const appRoute = express.Router();

appRoute.get("/", (req, res, next) => {
    res.status(200).json({ ok: true, message: "Hello world" });
});

module.exports = appRoute;