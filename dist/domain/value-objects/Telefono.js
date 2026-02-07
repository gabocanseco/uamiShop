"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Telefono = void 0;
class Telefono {
    constructor(value) {
        this.value = value;
        if (!value)
            throw new Error("Teléfono requerido");
        if (value.length < 10) {
            throw new Error("Teléfono inválido");
        }
    }
}
exports.Telefono = Telefono;
//# sourceMappingURL=Telefono.js.map