'use strict';

const bcrypt = require('bcrypt');
const TAG = 'user.controller.js :: ';
const USERS_IMAGE_DIR = './uploads/users/';
const COLUMNS = 'name surname email image role';
// const logger = require('../log4js.configuration');

/* MODULOS */

/** File System */

/* MODEL */
const User = require('../model/user.model');

/* Servicios */

/* ACTIONS */
function findAll(req, res) {
    var from = req.query.from || 0;
    from = Number(from);
    var size = req.query.size || 5;
    size = Number(size);

    User.find({}, COLUMNS)
        .skip(from)
        .limit(size)
        .exec((err, success) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    message: 'Error obteniendo usuarios.',
                    error: err
                });
            } else {
                User.count({}, (err, size) => {
                    res.status(200).json({
                        ok: true,
                        users: success,
                        count: size
                    });
                });
            }
        });
}

// =======================================================
// CREATE USER
// =======================================================
function create(req, res) {
    var body = req.body;

    var user = new User({
        name: body.name,
        surname: body.surname,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        image: body.image,
        role: body.role
    });

    user.save((err, success) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Error al crear un usuario.',
                error: err
            });
        } else {
            res.status(201).json({
                ok: true,
                user: success
            });
        }
    });
}

// =======================================================
// UPDATE
// =======================================================
function update(req, res) {
    const idUser = req.params['id'];
    User.findById(idUser, (err, success) => {
        if (err) {
            res.status(500).json({
                ok: false,
                message: 'Error al buscar el usuario para actualizar.',
                errors: err
            });
        } else {
            if (!success) {
                res.status(500).json({
                    ok: false,
                    message: 'El usuario no existe.',
                    errors: { message: 'El usuario no existe.' }
                });
            } else {
                const body = req.body;

                success.name = body.name;
                success.surname = body.surname;
                success.role = body.role;
                success.email = body.email;

                success.save((err, saved) => {
                    if (err) {
                        res.status(400).json({
                            ok: false,
                            message: 'Error al actualizar el usuario',
                            errors: err
                        });
                    } else {
                        saved.password = '(:';
                        res.status(200).json({
                            ok: true,
                            user: saved
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
    User.findByIdAndRemove(id, (err, success) => {
        if (err) {
            res.status(400).json({
                ok: false,
                message: 'Error al borrar al usuario',
                errors: err
            });
        } else {
            res.status(200).json({
                ok: true,
                user: success
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