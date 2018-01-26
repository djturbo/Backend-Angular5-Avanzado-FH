(function() {
    'use strict';

    const fs = require('fs');

    const User = require('../model/user.model');
    const Medico = require('../model/medico.model');
    const Hospital = require('../model/hospital.model');

    const controller = {};
    controller.TAG = 'upload.controller.js :: ';


    controller.upload = function(req, res) {
        const collection = req.params.collection;
        const files = req.files;
        const _id = req.params.id;

        console.log(controller.TAG, 'upload :: conllection: ', collection);

        // Validar colleciones
        const validCollections = ['user', 'medico', 'hospital'];
        if (validCollections.map(col => col === collection).length === 0) {
            return res.status(400).json({
                ok: false,
                message: 'Colección no válida',
                errors: 'Colección no válida: '
            });
        }

        if (!files) {
            res.status(400).json({
                ok: false,
                message: 'No se recibieron ficheros'
            });
        } else {
            const archivo = files.image.name;
            const mimetype = files.image.mimetype;
            var names = archivo.split('.');
            var extension = names[names.length - 1];
            // Solo extensiones aceptadas
            const validTypes = ['image/png', 'image/jpg', 'image/gif', 'image/jpeg'];
            if (validTypes.indexOf(mimetype) === -1) {
                return res.status(400).json({
                    ok: false,
                    message: 'Fichero no válido',
                    errors: 'los ficheros válidos son de tipo: ' + validTypes.join(', ')
                });
            }
            // Nombre del archivo

            const finalName = `${_id}-${new Date().getMilliseconds()}-${names[0]}.${extension}`;

            const path = `./upload/${collection}/${finalName}`;
            files.image.mv(path, (err) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error al guardar archivo',
                        errors: err
                    });
                } else {
                    saveCollection(collection, _id, finalName)
                        .then(okSave => {
                            delete files.image.data;
                            res.status(200).json({
                                ok: true,
                                message: 'uploaded file',
                                file: files.image,
                                [collection]: okSave
                            });
                        })
                        .catch(err => {
                            res.status(500).json({
                                ok: false,
                                message: 'Error al actualizar la colección: ' + collection,
                                errors: err
                            });
                        });
                }
            });

        }
    };

    function saveCollection(type, id, filename) {
        let model;
        switch (type) {
            case 'user':
                model = User;
                break;
            case 'hospital':
                model = Hospital;
                break;
            case 'medico':
                model = Medico;
                break;
        }
        let toDelete = `./upload/${type}/`;

        return new Promise((resolve, reject) => {
            model.findById(id, (err, success) => {
                if (err) {
                    reject(err);
                } else {
                    if (!success) {
                        reject('No existe');
                    }
                    toDelete += success.image;
                    if (fs.existsSync(toDelete)) {
                        fs.unlinkSync(toDelete);
                    }
                    success.image = filename;
                    success.save((err, data) => {
                        if (type === 'user') {
                            data.password = ':)';
                        }
                        resolve(data);
                    });
                }
            });
        });
    }

    module.exports = controller;
})();