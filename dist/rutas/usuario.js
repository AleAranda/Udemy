"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var usuario_1 = require("../modelos/usuario");
var bcrypt_1 = __importDefault(require("bcrypt"));
var autentificacion_1 = __importDefault(require("../middlewares/autentificacion"));
var usuarioRoutes = express_1.Router();
//===================================================================
// Crear usuario
//===================================================================
usuarioRoutes.post('/', autentificacion_1.default, function (req, res) {
    var body = req.body;
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para crear usuarios'
        });
    }
    var usuario = new usuario_1.Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt_1.default.hashSync(body.password, 10)
    });
    usuario.save(function (err, usuarioSave) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar usuario',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario guardado',
            usuario: usuarioSave
        });
    });
});
//===================================================================
// Modificar usuario
//===================================================================
usuarioRoutes.put('/', autentificacion_1.default, function (req, res) {
    var id = req.headers.id;
    var body = req.body;
    var usuario = req.body.usuario;
    if (usuario._id !== id) {
        if (usuario.role !== "ADMIN_ROLE") {
            return res.status(401).json({
                ok: false,
                mensaje: 'No puedes modificar datos que no son tuyos',
                usuario: usuario
            });
        }
    }
    usuario_1.Usuario.findByIdAndUpdate(id, function (err, usuarioDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar usuario',
                err: err
            });
        }
        if (!usuarioDB) {
            return res.status(401).json({
                ok: false,
                mensaje: 'El usuario no existe'
            });
        }
        usuarioDB.nombre = body.nombre;
        usuarioDB.apellido = body.apellido;
        usuarioDB.save(function (err, usuarioActualizado) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    err: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Usuario actualizado',
                usuario: usuarioActualizado
            });
        });
    });
});
//===================================================================
// Obtener usuarios y Paginacion en su busqueda
//===================================================================
usuarioRoutes.get('/', autentificacion_1.default, function (req, res) {
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para acceder a esta seccion'
        });
    }
    var desde = req.query.desde || 0;
    desde = Number(desde);
    usuario_1.Usuario.find({}, 'nombre apellido email')
        .skip(desde) //========================================
        .limit(5) //  Paginacion en Busqueda
        .exec(function (err, usuariosDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar usuarios de la base de datos',
                err: err
            });
        }
        if (usuariosDB.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No existen usuarios activos'
            });
        }
        res.status(200).json({
            ok: true,
            usuarios: usuariosDB,
            total: usuariosDB.length
        });
    });
});
//===================================================================
// Eliminar usuario
//===================================================================
usuarioRoutes.delete('/:id', autentificacion_1.default, function (req, res) {
    var id = req.headers.id;
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para eliminar usuarios'
        });
    }
    if (admin._id === id) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No puedes eliminarte a ti mismo'
        });
    }
    usuario_1.Usuario.findByIdAndDelete(id, function (err, usuarioEliminado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al intentar eliminar usuario',
                err: err
            });
        }
        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id: ' + id + ' no existe'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado con exito',
            usuario: usuarioEliminado
        });
    });
});
exports.default = usuarioRoutes;
