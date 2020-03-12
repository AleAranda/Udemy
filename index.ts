import Server from './clases/server'
import mongoose from 'mongoose'
import { SERVER_PORT } from './global/environment';
import bodyParser  from'body-parser';
import cors from 'cors';

//importar rutas
import usuarioRoutes from './rutas/usuario';


const server = new Server ();


//BodyParser
server.app.use(bodyParser.urlencoded({extended: true})  );
server.app.use( bodyParser.json());

//CORS
server.app.use( cors ({ origin: true, credentials: true}) );

// seteo de rutas
server.app.use('/usuario', usuarioRoutes);


//conexion a la base de datos

mongoose.connect('mongodb://localhost/nematronix', {useCreateIndex:true, useNewUrlParser:true}, (err:any)=>{
    if (err) throw err;
    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
});

server.start(()=>{
    console.log(`Servidor corriendo en ${SERVER_PORT}`)
});
