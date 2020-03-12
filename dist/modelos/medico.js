"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
exports.medicoSchema = new mongoose_1.Schema({
    nombre: { type: String, required: [true, 'Nombre necesario'] },
    apellido: { type: String, required: [true, 'Apellido necesario'] },
    email: { type: String, unique: true, required: [true, 'Email debe ser Unico'] },
    img: { type: String, unique: false, required: false },
    password: { type: String, required: [true, 'la contraseña es necesaria'] },
}, { collection: 'medicos' });
exports.medicoSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe ser unico!' });
exports.Medico = mongoose_1.model("Medico", exports.medicoSchema);
