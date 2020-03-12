import { Router, Request, Response } from 'express';
import { IHospital } from '../interfaces/hospital';
import { Hospital } from '../modelos/hospital';
import verificatoken from '../middlewares/autentificacion';


const hospitalRoutes = Router();

//===================================================================
// Obtener Hospital
//===================================================================

hospitalRoutes.get('/', verificatoken, (req: Request, res: Response) => {

    var desde = req.query.desde || 0;
    desde = Number(desde)

    Hospital.find({}, 'nombre ')
            .skip(desde)                                
            .limit(5)                                    //LImite de la Paginacion
            .populate('usuario', 'nombre apellido')      //Funciona para ver mas datos en la peticion
            .exec( (err: any, hospitalDB) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al recuperar hospitales de la base de datos',
                        err: err
                    });
                }

                if ( hospitalDB.length === 0 ) {
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

hospitalRoutes.post('/', verificatoken, (req: Request, res: Response) => {

    const body: IHospital = req.body;
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para crear hospitales'
        });
    }

    const hospital = new Hospital({
        nombre: body.nombre,
    });

    hospital.save((err, hospitalSave) => {
        if ( err ) {
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

hospitalRoutes.put('/', verificatoken, (req: Request, res: Response) => {

    const id = req.headers.id;
    const usuario = req.body.usuario;
    var body: IHospital = req.body;

   if ( usuario.role !== "ADMIN_ROLE" ){
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para actualizar hospitales',
             usuario: usuario
         });
     }

     
    Hospital.findByIdAndUpdate(id, (err: any, hospitalDB: any) => {
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
        

        hospitalDB.save((err: any, hospitalActualizado: any) => {
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

hospitalRoutes.delete('/:id', verificatoken,(req: Request, res: Response) => {
    
    const id = req.headers.id;
    const admin = req.body.usuario;

    if ( admin.role !== 'ADMIN_ROLE' ) {
        return res.status(401).json({
            ok: false,
            mensaje: 'Necesitas ser administrador para eliminar hospitales'
        });
    }

    if ( admin._id === id ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No puedes eliminarte a ti mismo'
        });
    }

    Hospital.findByIdAndDelete(id, (err: any, hospitalEliminado) => {
        if ( err ) {
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


export default hospitalRoutes;