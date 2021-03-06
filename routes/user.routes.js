(function() {
    'use strict';

    const express = require('express');
    const userController = require('../controller/user.controller');
    const authMidleware = require('../midleware/authenticate.midleware');
    const isAdminMidleware = require('../midleware/isAdmin.midleware');
    const api = express.Router();

    api.get('/', [authMidleware.ensureAuth], userController.findAll);
    api.get('/one', [authMidleware.ensureAuth], userController.findOne);
    api.post('/', userController.create);
    api.put('/:id', [authMidleware.ensureAuth, isAdminMidleware.ensureAdminOrSameUser], userController.update);
    api.delete('/:id', [authMidleware.ensureAuth], userController.remove);
    module.exports = api;
})();