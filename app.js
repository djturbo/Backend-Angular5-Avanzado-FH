'use strcit';

// Requires
const express = require('express');
const mongoose = require('mongoose');
// Fileupload
const fileupload = require('express-fileupload');
// serve-index
const serveIndex = require('serve-index');
// path
const path = require('path');

// Routes
const appRoute = require('./routes/index.routes');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const hospitalRoutes = require('./routes/hospital.routes');
const medicoRoutes = require('./routes/medico.routes');
const searchRoutes = require('./routes/search.routes');
const uploadRoutes = require('./routes/upload.routes');
const imageRoutes = require('./routes/image.routes');

const bodyParser = require('body-parser');

// Constants
var port = process.env.PORT || 1111;

// Inicializar variables
var app = express();

// ===============================================
// BODY PARSER
// ===============================================

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// ===============================================
// END BODY PARSER
// ===============================================

// ================================================
// SERVER INDEX CONFIG
// ================================================

app.use(express.static(__dirname + '/'))
app.use('/upload', serveIndex(__dirname + '/upload'));

// ================================================
// END SERVER INDEX CONFIG
// ================================================

// ================================================
// FILEUPLOAD
// ================================================

app.use(fileupload());

// ================================================
// END FILEUPLOAD
// ================================================



// ================================================
// CORS
// ================================================
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Allow', 'GET, OPTIONS, PUT, POST, DELETE');

    next();
});

// ================================================
// END CORS
// ================================================

// =====================================
// Rutas
// =====================================
app.use('/', appRoute);
/** api/user */
app.use('/api/user', userRoutes);
/** auth */
app.use('/auth', authRoutes);
/** hospitales */
app.use('/api/hospital', hospitalRoutes);
/** médicos */
app.use('/api/medico', medicoRoutes);
/** search */
app.use('/api/search', searchRoutes);
/** upload */
app.use('/api/upload', uploadRoutes);
/** images */
app.use('/api/image', imageRoutes);

// Conectar a la base de datos
mongoose.connection.openUri(
    'mongodb://localhost:27017/hospitalDB',
    (err, res) => {
        if (err) {
            throw err;
        } else {
            console.log('Mongodb \x1b[32m%s\x1b[0m', 'online');
            // Escuchar peticiones
            app.listen(port, () => {
                console.log(
                    'Express server port: \x1b[32m%s',
                    port,
                    '\x1b[0m',
                    'online'
                );
            });
        }
    }
);