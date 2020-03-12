"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
exports.hospitalSchema = new mongoose_1.Schema({
    nombre: { type: String, required: [true, 'Nombre necesario'] },
    img: { type: String, unique: false, required: false },
}, { collection: 'hospitales' });
exports.hospitalSchema.plugin(mongoose_unique_validator_1.default, { message: '{PATH} debe ser unico!' });
exports.Hospital = mongoose_1.model("Hospital", exports.hospitalSchema);
