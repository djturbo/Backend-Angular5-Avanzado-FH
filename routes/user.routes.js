'use strict';

const express = require('express');
const userController = require('../controller/user.controller');
const authMidleware = require('../midleware/authenticate.midleware');

const api = express.Router();

api.get('/', [authMidleware.ensureAuth], userController.findAll);
api.post('/', userController.create);
api.put('/:id', [authMidleware.ensureAuth], userController.update);
api.delete('/:id', [authMidleware.ensureAuth], userController.remove);
module.exports = api;