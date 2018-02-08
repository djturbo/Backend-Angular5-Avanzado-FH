(function() {
    'use strict';
    const jwt = require('jsonwebtoken');
    const moment = require('moment');
    const SECRET = require('../config/config').SEED;

    exports.ensureAdmin = function(req, res, next) {
        if (req.user.user.role !== 'ADMIN_ROLE') {
            return res.status(401).send({ ok: false, message: 'Only Admin user is admited for this action.' });
        } else {
            next();
        }
    };

    exports.ensureAdminOrSameUser = function(req, res, next) {

        if (req.user.user.role === 'ADMIN_ROLE' || req.user.user._id === req.params.id) {
            next();
        } else {
            return res.status(401).send({ ok: false, message: 'Only Admin user is admited for this action.' });
        }
    };
})();