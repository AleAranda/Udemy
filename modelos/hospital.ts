import {Document,Schema,Model,model} from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import { IHospital } from '../interfaces/hospital';


export interface IHospitalModel extends IHospital, Document {
    fullname:string;
}

export var hospitalSchema: Schema = new Schema ({

    nombre: {type: String, required:[true,'Nombre necesario']},
    img: {type:String, unique:false, required:false},

}, {collection: 'hospitales'});

hospitalSchema.plugin(uniqueValidator, {message: '{PATH} debe ser unico!'});

export const Hospital: Model<IHospitalModel> = model<IHospitalModel>("Hospital", hospitalSchema);