(function() {
    'use strict';

    const TAG = 'hospital.controller.js :: ';
    const COLUMNS = 'name image user';

    /* MODULOS */

    /** File System */

    /* MODEL */
    const Hospital = require('../model/hospital.model');

    /* Servicios */

    /* ACTIONS */

    // =====================================
    // FIND ALL HOSPITALES
    // =====================================
    function findAll(req, res) {
        var from = req.query.from || 0;
        from = Number(from);
        var size = req.query.size || 5;
        size = Number(size);

        Hospital.find({}, COLUMNS)
            .populate('user', 'name email')
            .limit(size)
            .skip(from)
            .exec((err, success) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        message: 'Error obteniendo hospitales.',
                        error: err
                    });
                } else {
                    Hospital.count({}, (err, size) => {
                        res.status(200).json({
                            ok: true,
                            hospitales: success,
                            count: size
                        });
                    });
                }
            });
    }

    // =======================================================
    // CREATE HOSPITAL
    // =======================================================
    function create(req, res) {
        var body = req.body;
        console.log('CREATE Hospital user: ', req.user.user._id);
        var hospital = new Hospital({
            name: body.name,
            user: req.user.user._id
        });

        hospital.save((err, success) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Error al crear un hospital.',
                    error: err
                });
            } else {
                res.status(201).json({
                    ok: true,
                    hospital: success
                });
            }
        });
    }

    // =======================================================
    // UPDATE
    // =======================================================
    function update(req, res) {
        const idHospital = req.params['id'];
        Hospital.findById(idHospital, (err, success) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    message: 'Error al buscar el hospital para actualizar.',
                    errors: err
                });
            } else {
                if (!success) {
                    res.status(500).json({
                        ok: false,
                        message: 'El hospital no existe.',
                        errors: { message: 'El hospital no existe.' }
                    });
                } else {
                    const body = req.body;

                    success.name = body.name;
                    success.image = body.image;
                    success.user = req.user.user._id;
                    success.save((err, saved) => {
                        if (err) {
                            res.status(400).json({
                                ok: false,
                                message: 'Error al actualizar el hospital',
                                errors: err
                            });
                        } else {
                            res.status(200).json({
                                ok: true,
                                hospital: saved
                            });
                        }
                    });
                }
            }
        });
    }
    // =======================================================
    // DELTE
    // =======================================================
    function remove(req, res) {
        const id = req.params['id'];
        Hospital.findByIdAndRemove(id, (err, success) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Error al borrar al hospital',
                    errors: err
                });
            } else {
                res.status(200).json({
                    ok: true,
                    hospital: success
                });
            }
        });
    }
    module.exports = {
        findAll,
        create,
        update,
        remove
    };
})();