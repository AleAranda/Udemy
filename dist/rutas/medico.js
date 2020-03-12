"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var medico_1 = require("../modelos/medico");
var autentificacion_1 = __importDefault(require("../middlewares/autentificacion"));
var medicoRoutes = express_1.Router();
//===================================================================
// Crear medico
//===================================================================
medicoRoutes.post('/', autentificacion_1.default, function (req, res) {
    var body = req.body;
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para crear medicos'
        });
    }
    var medico = new medico_1.Medico({
        nombre: body.nombre,
    });
    medico.save(function (err, medicoSave) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar Medico',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Medico guardado',
            medico: medicoSave
        });
    });
});
//===================================================================
// Modificar medico
//===================================================================
medicoRoutes.put('/', autentificacion_1.default, function (req, res) {
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
    medico_1.Medico.findByIdAndUpdate(id, function (err, medicoDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar medico',
                err: err
            });
        }
        if (!medicoDB) {
            return res.status(401).json({
                ok: false,
                mensaje: 'El medico no existe'
            });
        }
        medicoDB.nombre = body.nombre;
        medicoDB.apellido = body.apellido;
        medicoDB.email = body.email;
        medicoDB.save(function (err, medicoActualizado) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    err: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Medico actualizado',
                medico: medicoActualizado
            });
        });
    });
});
//===================================================================
// Obtener medicos
//===================================================================
medicoRoutes.get('/', autentificacion_1.default, function (req, res) {
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para acceder a esta seccion'
        });
    }
    var desde = req.query.desde || 0;
    desde = Number(desde);
    medico_1.Medico.find({}, 'nombre apellido email')
        .skip(desde)
        .limit(5)
        .exec(function (err, medicosDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar medicos de la base de datos',
                err: err
            });
        }
        if (medicosDB.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No existen medicos activos'
            });
        }
        res.status(200).json({
            ok: true,
            medicos: medicosDB,
            total: medicosDB.length
        });
    });
});
//===================================================================
// Eliminar medico
//===================================================================
medicoRoutes.delete('/:id', autentificacion_1.default, function (req, res) {
    var id = req.headers.id;
    var admin = req.body.medico;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para eliminar medicos'
        });
    }
    if (admin._id === id) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No puedes eliminarte a ti mismo'
        });
    }
    medico_1.Medico.findByIdAndDelete(id, function (err, medicoEliminado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al intentar eliminar medico',
                err: err
            });
        }
        if (!medicoEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id: ' + id + ' no existe'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Medico eliminado con exito',
            medico: medicoEliminado
        });
    });
});
exports.default = medicoRoutes;
