(function() {
    'use strict';

    var express = require('express');

    var searchRoutes = express.Router();

    var searchController = require('../controller/search.controller');

    searchRoutes.get('/:collection', searchController.findByCollection);
    searchRoutes.get('/', searchController.findAll);

    module.exports = searchRoutes;
})();