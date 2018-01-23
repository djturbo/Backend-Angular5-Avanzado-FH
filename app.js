// Requires
var express = require("express");
var mongoose = require('mongoose');

// Constants
var port = process.env.PORT || 1111;

// Inicializar variables
var app = express();



// Rutas
app.get("/", (req, res, next) => {
    res.status(200).json({ ok: true, message: "Hello world" });
});



// Conectar a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("Mongodb \x1b[32m%s\x1b[0m", "online");
        // Escuchar peticiones
        app.listen(port, () => {
            console.log("Express server port: \x1b[32m%s", port, "\x1b[0m", "online");
        });
    }
});