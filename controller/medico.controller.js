(function() {
    'use strict';

    const TAG = 'medico.controller.js :: ';
    const COLUMNS = 'name image user hospital';

    /* MODULOS */

    /** File System */

    /* MODEL */
    const Medico = require('../model/medico.model');

    /* Servicios */

    /* ACTIONS */

    // =====================================
    // FIND MEDICO BY ID
    // =====================================
    function findOne(req, res) {
        const id = req.params.id;
        console.log('id medico: ', id);
        Medico.findById(id)
            .populate({ path: 'user', select: 'name _id email surname image' })
            .populate({ path: 'hospital', select: 'name _id image' })
            .exec((err, medico) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        message: 'Error obteniendo medicos.',
                        error: err
                    });
                } else {
                    res.status(200).json({
                        ok: true,
                        medico: medico
                    });
                }
            });
    }
    // =====================================
    // FIND ALL MEDICOS
    // =====================================
    function findAll(req, res) {
        var from = req.query.from || 0;
        from = Number(from);
        var rowSize = req.query.size || 5;
        rowSize = Number(rowSize);

        Medico.find({})
            .populate('User')
            .populate('Hospital')
            .skip(from)
            .limit(rowSize)
            .exec((err, success) => {
                if (err) {
                    res.status(500).json({
                        ok: false,
                        message: 'Error obteniendo medicos.',
                        error: err
                    });
                } else {
                    Medico.count({}, (err, size) => {
                        res.status(200).json({
                            ok: true,
                            medicos: success,
                            count: size
                        });
                    });
                }
            });
    }

    // =======================================================
    // CREATE MEDICO
    // =======================================================
    function create(req, res) {
        var body = req.body;

        var medico = new Medico({
            name: body.name,
            user: req.user.user._id,
            hospital: body.hospital
        });

        medico.save((err, success) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Error al crear un medico.',
                    error: err
                });
            } else {
                res.status(201).json({
                    ok: true,
                    medico: success
                });
            }
        });
    }

    // =======================================================
    // UPDATE
    // =======================================================
    function update(req, res) {
        const id = req.params['id'];
        Medico.findById(id, (err, success) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    message: 'Error al buscar al medico para actualizar.',
                    errors: err
                });
            } else {
                if (!success) {
                    res.status(500).json({
                        ok: false,
                        message: 'El medico no existe.',
                        errors: { message: 'El medico no existe.' }
                    });
                } else {
                    const body = req.body;

                    success.name = body.name;
                    success.image = body.image;
                    success.user = req.user.user._id;
                    success.hospital = body.hospital;

                    success.save((err, saved) => {
                        if (err) {
                            res.status(400).json({
                                ok: false,
                                message: 'Error al actualizar al medico',
                                errors: err
                            });
                        } else {
                            res.status(200).json({
                                ok: true,
                                medico: saved
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
        Medico.findByIdAndRemove(id, (err, success) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: 'Error al borrar al médico',
                    errors: err
                });
            } else {
                res.status(200).json({
                    ok: true,
                    medico: success
                });
            }
        });
    }
    module.exports = {
        findAll,
        findOne,
        create,
        update,
        remove
    };
})();