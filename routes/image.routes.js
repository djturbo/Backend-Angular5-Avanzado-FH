(function() {
    'use strict';
    const express = require('express');
    const imageController = require('../controller/image.controller');

    const imageRoutes = express.Router();


    imageRoutes.get('/:collection/:filename', imageController.getImage);

    module.exports = imageRoutes;
})();