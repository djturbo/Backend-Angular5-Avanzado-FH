(function() {
    'use strict';
    const TAG = 'search.controller.js :: ';
    var exports = {};

    var Hospital = require('../model/hospital.model');
    var Medico = require('../model/medico.model');
    var User = require('../model/user.model');

    // =============================================
    // BUSQUEDA GENÉRICA
    // =============================================
    exports.findByCollection = function(req, res) {
        var collection = req.params['collection'];
        var toSearch = req.query.tosearch;
        var regex = new RegExp(toSearch, 'i');
        var promesa;

        switch (collection) {
            case 'user':
                promesa = searchUsers(toSearch, regex);
                console.log(
                    TAG,
                    'findByCollection :: toSerach: ',
                    toSearch,
                    ' regex: ',
                    regex
                );
                break;
            case 'hospital':
                promesa = searchHospitals(toSearch, regex);
                break;
            case 'medico':
                promesa = searchMedicos(toSearch, regex);
                break;
            default:
                res.status(400).json({
                    ok: false,
                    message: 'Las colecciones válidas son user, hospital o medico'
                });
                break;
        }
        if (promesa) {
            promesa
                .then(data => {
                    res.status(200).json({ ok: true, [collection]: data });
                })
                .catch(err => {
                    res.status(400).json({
                        ok: false,
                        message: 'Error al buscar por colección',
                        errors: err
                    });
                });
        }
    };
    // =============================================
    // BUSQUEDA GENÉRICA
    // =============================================
    exports.findAll = function(req, res) {
        var toSearch = req.query.tosearch;
        var regex = new RegExp(toSearch, 'i');
        console.log('toSearch: ', toSearch);
        Promise.all([
                searchHospitals(toSearch, regex),
                searchMedicos(toSearch, regex),
                searchUsers(toSearch, regex)
            ])
            .then(responses => {
                res.status(200).json({
                    ok: true,
                    hospitales: responses[0],
                    medicos: responses[1],
                    users: responses[2]
                });
            })
            .catch(error => {
                res.status(500).json({
                    ok: false,
                    message: 'Error al buscar por todas las colecciones.',
                    errors: error
                });
            });
    };
    // =============================================
    // BUSCAR HOSPITALES
    // =============================================
    function searchHospitals(toSearch, regex) {
        return new Promise((resolve, reject) => {
            Hospital.find({ name: regex })
                .populate('user', 'name surname email')
                .exec((err, hospitales) => {
                    if (err) {
                        console.log('error al buscar hospitales error: ', err);
                        reject(err);
                    } else {
                        console.log('hospitales encontrados: ', hospitales);
                        resolve(hospitales);
                    }
                });
        });
    }
    // =============================================
    // BUSCAR MEDICOS
    // =============================================
    function searchMedicos(toSearch, regex) {
        return new Promise((resolve, reject) => {
            Medico.find({ name: regex })
                .populate('user', 'name surname email')
                .populate('hospital')
                .exec((err, medicos) => {
                    if (err) {
                        reject('Error al buscar medicos errors: ', err);
                    } else {
                        resolve(medicos);
                    }
                });
        });
    }
    // =============================================
    // BUSCAR USUARIOS
    // =============================================
    function searchUsers(toSearch, regex) {
        return new Promise((resolve, reject) => {
            User.find({}, 'name surname email role image google_signed')
                .or([{ name: regex }, { email: regex }, { surname: regex }])
                .exec((err, users) => {
                    if (err) {
                        reject('Error al buscar usuarios errors: ', err);
                    } else {
                        resolve(users);
                    }
                });
        });
    }

    module.exports = exports;
})();