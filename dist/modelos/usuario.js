"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
var RolesValidos = {
    values: ['ADMIN_ROL', 'USER_ROL'],
    message: '{value} Rol no valido'
};
exports.usuarioSchema = new mongoose_1.Schema({
    nombre: { type: String, required: [true, 'Nombre necesario'] },
    apellido: { type: String, required: [true, 'Apellido necesario'] },
    img: { type: String, unique: false, required: false },
    password: { type: String, required: [true, 'la contraseña es necesaria'] },
    rol: { type: String, enum: RolesValidos, default: 'USER_ROL' },
}, { collection: 'usuarios' });
exports.usuarioSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe ser unico!' });
exports.Usuario = mongoose_1.model("Usuario", exports.usuarioSchema);
