"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_1 = require("../modelos/usuario");
var environment_1 = require("../global/environment");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var loginRoutes = express_1.Router();
//===================================================================
// login de usuario
//===================================================================
loginRoutes.post('/', function (req, res) {
    var body = req.body;
    usuario_1.Usuario.findOne({ email: body.email }, function (err, usuarioDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error en la base de datos',
                err: err
            });
        }
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                mensaje: 'El usuairo no existe'
            });
        }
        if (!bcrypt_1.default.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Contraseña Incorrecta',
            });
        }
        var token = jsonwebtoken_1.default.sign({ usuario: usuarioDB }, environment_1.SEED, { expiresIn: 18000 });
        res.status(200).json({
            ok: true,
            token: token,
            usuario: usuarioDB
        });
    });
});
exports.default = loginRoutes;
