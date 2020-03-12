import { Router, Request, Response } from 'express';
import { IUsuario } from '../interfaces/usuario';
import { Usuario } from '../modelos/usuario';
import bcrypt from 'bcrypt';
import verificatoken from '../middlewares/autentificacion';


const usuarioRoutes = Router();

//===================================================================
// Crear usuario
//===================================================================

usuarioRoutes.post('/', verificatoken, (req: Request, res: Response) => {

    const body: IUsuario = req.body;
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para crear usuarios'
        });
    }

    const usuario = new Usuario({
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10)
    });

    usuario.save((err, usuarioSave) => {
        if ( err ) {
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

usuarioRoutes.put('/', verificatoken, (req: Request, res: Response) => {

    const id = req.headers.id;
    const body: IUsuario = req.body;
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

    Usuario.findByIdAndUpdate(id, (err: any, usuarioDB: any) => {
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
        

        usuarioDB.save((err: any, usuarioActualizado: any) => {
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
// Obtener usuarios
//===================================================================

usuarioRoutes.get('/', verificatoken, (req: Request, res: Response) => {
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para acceder a esta seccion'
        });
    }

    Usuario.find({}, 'nombre apellido email')
            .exec( (err: any, usuariosDB) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al recuperar usuarios de la base de datos',
                        err: err
                    });
                }

                if ( usuariosDB.length === 0 ) {
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

usuarioRoutes.delete('/:id', verificatoken,(req: Request, res: Response) => {
    const id = req.headers.id;
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para eliminar usuarios'
        });
    }

    if ( admin._id === id ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No puedes eliminarte a ti mismo'
        });
    }

    Usuario.findByIdAndDelete(id, (err: any, usuarioEliminado) => {
        if ( err ) {
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


export default usuarioRoutes;