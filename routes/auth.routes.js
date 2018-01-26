(function() {
    'use strict';

    const express = require('express');
    const authController = require('../controller/auth.controller');

    const authRouter = express.Router();

    authRouter.post('/login', authController.login);
    authRouter.post('/logout', authController.logout);


    module.exports = authRouter;
})();