(function() {
    'use strict';

    const jwt = require('jsonwebtoken');
    const moment = require('moment');
    const SECRET = require('../config/config').SEED;

    exports.ensureAuth = function(req, res, next) {
        var payload = {};
        if (!req.headers.authorization) {
            return res.status(403).send({ ok: false, message: 'Not Authorization header found' });
        } else {
            var token = req.headers.authorization.trim();
            jwt.verify(token, SECRET, (err, decoded) => {
                if (err) {
                    res.status(403).send({ message: 'token no válido' });
                } else {
                    payload = decoded;
                    req.user = payload;
                    req.token = createToken(payload.user);
                    next();
                }
            });
        }
    };

    function createToken(user) {
        return jwt.sign({ user }, SECRET, { expiresIn: 14400 }); // expira en 4h
    }
})();