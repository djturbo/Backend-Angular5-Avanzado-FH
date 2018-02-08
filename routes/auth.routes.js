(function() {
    'use strict';

    const express = require('express');
    const authController = require('../controller/auth.controller');
    const authMidleware = require('../midleware/authenticate.midleware');

    const authRouter = express.Router();

    authRouter.post('/login', authController.login);
    authRouter.post('/oauth', authController.oauth);
    authRouter.post('/logout', authController.logout);
    authRouter.post('/refresh', [authMidleware.ensureAuth], authController.renewToken);

    module.exports = authRouter;
})();