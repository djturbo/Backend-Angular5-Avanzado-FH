(function() {
    'use strict';
    const TAG = 'auth.controller.js :: ';
    const bcrypt = require('bcrypt');
    const User = require('../model/user.model');
    const jwt = require('jsonwebtoken');


    const SECRET = require('../config/config').SEED;

    // Google Auth
    const { OAuth2Client } = require('google-auth-library');

    const GOOGLE_OAUTH2 = require('../config/config').GOOGLE_OAUTH2;

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
                            menu: getMenu(success.role),
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
    function renewToken(req, res) {
        if (req.token) {
            res.status(200).json({
                ok: true,
                message: 'Token renovado correctamente',
                token: req.token
            });
        } else {
            req.status(401).json({
                ok: false,
                message: 'Token not avalible',
                error: 'Token unavalible'
            });
        }
    }
    // =============================================
    // O-AUTH-GOOGLE
    // =============================================

    function oauth(req, res) {

        const token = req.body.token || 'xxx';
        console.log(TAG, 'oauth :: token: ', token.length > 3);
        const CLIENT_ID = GOOGLE_OAUTH2.CLIENT_ID;
        var client = new OAuth2Client(GOOGLE_OAUTH2.CLIENT_ID, GOOGLE_OAUTH2.SECRET);
        client.verifyIdToken({ idToken: token, CLIENT_ID }) // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
            .then(login => {
                var payload = login.getPayload();
                var userid = payload.sub;

                // If request specified a G Suite domain:
                //var domain = payload['hd'];
                User.findOne({ email: payload.email }, (err, found) => {
                    if (err) {
                        return res.status(500).json({
                            ok: false,
                            message: 'Error al crear el usuario',
                            errors: err
                        });
                    } else {
                        if (!found) {
                            let user = new User({
                                name: payload.given_name,
                                surname: payload.family_name,
                                email: payload.email,
                                password: ':)',
                                role: 'USER_ROLE',
                                google_signed: true,
                                image: payload.picture,
                                menu: getMenu('USER_ROLE')

                            });
                            user.save((err, success) => {
                                if (err) {
                                    return res.status(500).json({
                                        ok: false,
                                        message: 'Error al crear al usuario',
                                        errors: err
                                    });
                                } else {
                                    const token = createToken(success);
                                    return res.status(200).json({
                                        ok: true,
                                        message: 'Usuario creado correctamente.',
                                        user: success,
                                        token: token,
                                        menu: getMenu(success.role)
                                    });
                                }
                            });
                        } else {
                            if (!found.google_signed) {
                                sendUnsuccessMessage(res, 'Use la autenticación regular.');
                            } else {
                                found.password = ':)';
                                const token = createToken(found);
                                res.status(200).json({
                                    ok: true,
                                    message: 'Log in is working',
                                    user: found,
                                    menu: getMenu(found.role),
                                    token: token
                                });
                            }
                        }
                    }
                });
            })
            .catch(e => {
                sendUnsuccessMessage(res, 'Verificación inválida. err: ' + e);
            });
    }

    // =============================================
    // END O-AUTH-GOOGLE
    // =============================================

    // =============================================
    // RENUEVA TOKEN
    // =============================================





    function logout(req, res) {
        res.status(200).json({
            ok: true,
            message: 'Log out is working'
        });
    }

    function getMenu(role) {
        const menu = [{
                title: 'Principal',
                icon: 'mdi mdi-gauge',
                submenu: [
                    { title: 'Dashboard', url: '/dashboard' },
                    { title: 'ProgressBar', url: '/progress' },
                    { title: 'Gráficas', url: '/graficas' },
                    { title: 'Promesas', url: '/promesas' },
                    { title: 'RXJS', url: '/rxjs' }
                ]
            },
            {
                title: 'Mantenimiento',
                icon: 'mdi mdi-folder-lock-open',
                submenu: [
                    { title: 'Hospitales', url: '/hospitals' },
                    { title: 'Médicos', url: '/doctors' }
                ]
            }
        ];
        if (role === 'ADMIN_ROLE') {
            menu[1].submenu.unshift({ title: 'Usuarios', url: '/users' });
        }
        return menu;
    }

    module.exports = {
        login,
        logout,
        renewToken,
        oauth
    }
})();