"use strict";

var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol permitido'
};

var userSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es requerido'] },
    surname: { type: String, required: [true, 'El Apellido es requerido'] },
    email: { type: String, required: [true, 'El correo electrónico es requerido'], unique: true },
    password: { type: String, required: [true, 'La contraseña es requerido'] },
    image: { type: String },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }

});

userSchema.plugin(uniqueValidator, { message: '{PATH} debe ser único.' });

module.exports = mongoose.model('User', userSchema);