import { Request, Response, Router } from 'express';
import { Usuario } from '../modelos/usuario';
import { SEED } from '../global/environment';
import jwd from 'jsonwebtoken';
import bcrypt from 'bcrypt';


const loginRoutes = Router();

//===================================================================
// login de usuario
//===================================================================
loginRoutes.post('/', (req: Request, res: Response) => {

    const body = req.body;

    Usuario.findOne({ email: body.email }, (err:any, usuarioDB) => {
        
        if (err){
            return res.status(500).json({
                ok:false,
                mensaje:'Error en la base de datos',
                err: err
           });
           
        }
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                mensaje: 'El usuairo no existe'
            });
        }

        if( !bcrypt.compareSync(body.password, usuarioDB.password) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Contraseña Incorrecta',
            });  
        }

        const token = jwd.sign( { usuario: usuarioDB }, SEED, { expiresIn: 18000 });
        
        res.status(200).json({
            ok: true,
            token: token,
            usuario: usuarioDB
        });
    });
});

export default loginRoutes;