"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = __importDefault(require("./clases/server"));
var mongoose_1 = __importDefault(require("mongoose"));
var environment_1 = require("./global/environment");
var body_parser_1 = __importDefault(require("body-parser"));
var cors_1 = __importDefault(require("cors"));
//importar rutas
var usuario_1 = __importDefault(require("./rutas/usuario"));
var login_1 = __importDefault(require("./rutas/login"));
var server = new server_1.default();
//BodyParser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//CORS
server.app.use(cors_1.default({ origin: true, credentials: true }));
// seteo de rutas
server.app.use('/usuario', usuario_1.default);
server.app.use('/login', login_1.default);
//Conexion a la base de datos
mongoose_1.default.connect('mongodb://localhost/nematronix', { useCreateIndex: true, useNewUrlParser: true }, function (err) {
    if (err)
        throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});
server.start(function () {
    console.log("Servidor corriendo en " + environment_1.SERVER_PORT);
});
