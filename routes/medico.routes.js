(function() {
    'use strict';

    const express = require('express');
    const medicoController = require('../controller/medico.controller');
    const authMidleware = require('../midleware/authenticate.midleware');

    const medicoRoutes = express.Router();

    medicoRoutes.get('/', medicoController.findAll);
    medicoRoutes.get('/:id', medicoController.findOne);
    medicoRoutes.post('/', [authMidleware.ensureAuth], medicoController.create);
    medicoRoutes.put('/:id', [authMidleware.ensureAuth], medicoController.update);
    medicoRoutes.delete('/:id', [authMidleware.ensureAuth], medicoController.remove);

    module.exports = medicoRoutes;
})();