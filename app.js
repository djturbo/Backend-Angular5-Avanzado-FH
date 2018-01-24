// Requires
const express = require("express");
const mongoose = require('mongoose');
// Routes
const appRoute = require('./routes/index.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');

const bodyParser = require('body-parser');

// Constants
var port = process.env.PORT || 1111;

// Inicializar variables
var app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Rutas
app.use('/', appRoute);
/** api/user */
app.use('/api/user', userRoutes);
/** auth */
app.use('/auth', authRoutes);


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