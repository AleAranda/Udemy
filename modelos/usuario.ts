import {Document,Schema,Model,model} from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IUsuario } from '../interfaces/usuario';

export interface IUsuarioModel extends IUsuario, Document {
    fullname:string;
}

const RolesValidos ={
    values:['ADMIN_ROL', 'USER_ROL'],
    message: '{value} Rol no valido'
}

export var usuarioSchema: Schema = new Schema ({

    nombre: {type: String, required:[true,'Nombre necesario']},
    apellido: {type: String, required: [true, 'Apellido necesario']},
    img: {type:String, unique:false, required:false},
    password: {type: String, required:[true, 'la contraseña es necesaria']},
    rol: {type:String, enum:RolesValidos, default: 'USER_ROL'},

}, {collection: 'usuarios'});

usuarioSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico!'});

export const Usuario: Model<IUsuarioModel> = model<IUsuarioModel>("Usuario", usuarioSchema);