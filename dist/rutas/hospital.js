"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var hospital_1 = require("../modelos/hospital");
var autentificacion_1 = __importDefault(require("../middlewares/autentificacion"));
var hospitalRoutes = express_1.Router();
//===================================================================
// Obtener Hospital
//===================================================================
hospitalRoutes.get('/', autentificacion_1.default, function (req, res) {
    hospital_1.Hospital.find({}, 'nombre ')
        .exec(function (err, hospitalDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al recuperar hospitales de la base de datos',
                err: err
            });
        }
        if (hospitalDB.length === 0) {
            return res.status(404).json({
                ok: false,
                mensaje: 'No existen hospitales activos'
            });
        }
        res.status(200).json({
            ok: true,
            hospital: hospitalDB,
            total: hospitalDB.length
        });
    });
});
//===================================================================
// Crear Hospital
//===================================================================
hospitalRoutes.post('/', autentificacion_1.default, function (req, res) {
    var body = req.body;
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para crear hospitales'
        });
    }
    var hospital = new hospital_1.Hospital({
        nombre: body.nombre,
    });
    hospital.save(function (err, hospitalSave) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al guardar hospital',
                err: err
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Hospital guardado',
            hospital: hospitalSave
        });
    });
});
//===================================================================
// Modificar usuario
//===================================================================
hospitalRoutes.put('/', autentificacion_1.default, function (req, res) {
    var id = req.headers.id;
    var usuario = req.body.usuario;
    var body = req.body;
    if (usuario.role !== "ADMIN_ROLE") {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para actualizar hospitales',
            usuario: usuario
        });
    }
    hospital_1.Hospital.findByIdAndUpdate(id, function (err, hospitalDB) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al actualizar hospital',
                err: err
            });
        }
        if (!hospitalDB) {
            return res.status(401).json({
                ok: false,
                mensaje: 'El hospital no existe'
            });
        }
        hospitalDB.nombre = body.nombre;
        hospitalDB.save(function (err, hospitalActualizado) {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    err: err
                });
            }
            res.status(200).json({
                ok: true,
                mensaje: 'Hospital actualizado',
                hospital: hospitalActualizado
            });
        });
    });
});
//===================================================================
// Eliminar usuario
//===================================================================
hospitalRoutes.delete('/:id', autentificacion_1.default, function (req, res) {
    var id = req.headers.id;
    var admin = req.body.usuario;
    if (admin.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para eliminar hospitales'
        });
    }
    if (admin._id === id) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No puedes eliminarte a ti mismo'
        });
    }
    hospital_1.Hospital.findByIdAndDelete(id, function (err, hospitalEliminado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Ocurrio un error al intentar eliminar hospital',
                err: err
            });
        }
        if (!hospitalEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id: ' + id + ' no existe'
            });
        }
        res.status(200).json({
            ok: true,
            mensaje: 'Usuario eliminado con exito',
            hospital: hospitalEliminado
        });
    });
});
exports.default = hospitalRoutes;
