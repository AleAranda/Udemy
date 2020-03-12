import { Router, Request, Response } from 'express';
import { IMedico } from '../interfaces/medico';
import { Medico } from '../modelos/medico';
import bcrypt from 'bcrypt';
import verificatoken from '../middlewares/autentificacion';


const medicoRoutes = Router();

//===================================================================
// Crear medico
//===================================================================

medicoRoutes.post('/', verificatoken, (req: Request, res: Response) => {

    const body: IMedico= req.body;
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para crear medicos'
        });
    }

    const medico = new Medico({
        nombre: body.nombre,
    });

    medico.save((err, medicoSave) => {
        if ( err ) {
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

medicoRoutes.put('/', verificatoken, (req: Request, res: Response) => {

    const id = req.headers.id;
    const body: IMedico = req.body;
    const usuario = req.body.usuario;

    if ( usuario._id !== id ) {
        if ( usuario.role !== "ADMIN_ROLE" ){
            return res.status(401).json({
                ok: false,
                mensaje: 'No puedes modificar datos que no son tuyos',
                usuario: usuario
            });
        }
    }

    Medico.findByIdAndUpdate(id, (err: any, medicoDB: any) => {
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
        

        medicoDB.save((err: any, medicoActualizado: any) => {
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

medicoRoutes.get('/', verificatoken, (req: Request, res: Response) => {
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para acceder a esta seccion'
        });
    }

    Medico.find({}, 'nombre apellido email')
            .exec( (err: any, medicosDB) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al recuperar medicos de la base de datos',
                        err: err
                    });
                }

                if ( medicosDB.length === 0 ) {
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

medicoRoutes.delete('/:id', verificatoken,(req: Request, res: Response) => {
    const id = req.headers.id;
    const admin = req.body.medico;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para eliminar medicos'
        });
    }

    if ( admin._id === id ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No puedes eliminarte a ti mismo'
        });
    }

    Medico.findByIdAndDelete(id, (err: any, medicoEliminado) => {
        if ( err ) {
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


export default medicoRoutes;