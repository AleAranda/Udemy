import {Document,Schema,Model,model} from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IMedico } from '../interfaces/medico';

export interface IMedicoModel extends IMedico, Document {
    fullname:string;
}


export var medicoSchema: Schema = new Schema ({

    nombre: {type: String, required:[true,'Nombre necesario']},
    apellido: {type: String, required: [true, 'Apellido necesario']},
    email: {type: String, unique: true, required: [ true, 'Email debe ser Unico']},
    img: {type:String, unique:false, required:false},
    password: {type: String, required:[true, 'la contraseña es necesaria']},

}, {collection: 'medicos'});

medicoSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico!'});

export const Medico: Model<IMedicoModel> = model<IMedicoModel>("Medico", medicoSchema);