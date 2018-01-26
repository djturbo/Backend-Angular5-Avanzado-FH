(function() {
    'use strict';

    const bcrypt = require('bcrypt');
    const User = require('../model/user.model');
    const jwt = require('jsonwebtoken');


    const SECRET = require('../config/config').SEED;

    // =============================================
    // LOG IN
    // =============================================
    function login(req, res) {
        const body = req.body;
        const email = body.email;
        var password = body.password;

        User.findOne({ email: email }, (err, success) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    message: 'Error al intentar autenticar al usuario.',
                    errors: err
                });
            } else {
                if (success) {
                    if (bcrypt.compare(password, success.password)) {
                        success.password = ':)';
                        const token = createToken(success);
                        res.status(200).json({
                            ok: true,
                            message: 'Log in is working',
                            user: success,
                            token: token
                        });
                    } else {
                        sendUnsuccessMessage(res, 'credenciales incorrectas.');
                    }
                } else {
                    sendUnsuccessMessage(res, 'Usuario no encontrado, credenciales incorrectas.');
                }
            }
        });
    }

    function sendUnsuccessMessage(res, msg) {
        return res.status(400).json({
            ok: false,
            message: msg
        });
    }

    function createToken(user) {
        return jwt.sign({ user }, SECRET, { expiresIn: 14400 }); // expira en 4h
    }

    // =============================================
    // LOG OUT
    // =============================================
    function logout(req, res) {
        res.status(200).json({
            ok: true,
            message: 'Log out is working'
        });
    }

    module.exports = {
        login,
        logout
    }
})();