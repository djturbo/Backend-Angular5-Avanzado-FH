(function() {
    const express = require('express');
    const uploadController = require('../controller/upload.controller');
    const uploadRoutes = express.Router();
    const authMidleware = require('../midleware/authenticate.midleware');

    uploadRoutes.put('/:collection/:id', [authMidleware.ensureAuth], uploadController.upload);

    module.exports = uploadRoutes;

})();