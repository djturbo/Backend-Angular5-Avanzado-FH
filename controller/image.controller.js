(function() {
    'use strict';
    const controller = {};
    // path
    const path = require('path');
    controller.TAG = 'image.controller.js :: ';

    const fs = require('fs');

    controller.getImage = function(req, res) {
        const image = req.params.filename;
        const collection = req.params.collection;
        console.log(controller.TAG, 'obteniendo imagen: ', image);
        let dir = `upload/${collection}/${image}`;

        fs.exists(dir, exists => {
            if (!exists) {
                dir = `assets/no-img.jpg`;
            }
            return res.sendFile(path.resolve(dir));

        });
    };


    module.exports = controller;
})();