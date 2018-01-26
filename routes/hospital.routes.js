'use strict'

const express = require('express');
const hospitalController = require('../controller/hospital.controller');
const authMidleware = require('../midleware/authenticate.midleware');

const hospitalRoutes = express.Router();

hospitalRoutes.get('/', hospitalController.findAll);
hospitalRoutes.post('/', [authMidleware.ensureAuth], hospitalController.create);
hospitalRoutes.put('/:id', [authMidleware.ensureAuth], hospitalController.update);
hospitalRoutes.delete('/:id', [authMidleware.ensureAuth], hospitalController.remove);
module.exports = hospitalRoutes;