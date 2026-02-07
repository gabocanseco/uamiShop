"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direccion = void 0;
class Direccion {
    constructor(calle, numero, colonia, ciudad, codigoPostal) {
        this.calle = calle;
        this.numero = numero;
        this.colonia = colonia;
        this.ciudad = ciudad;
        this.codigoPostal = codigoPostal;
        if (!calle)
            throw new Error("Calle requerida");
        if (!numero)
            throw new Error("Número requerido");
        if (!colonia)
            throw new Error("Colonia requerida");
        if (!ciudad)
            throw new Error("Ciudad requerida");
        if (!codigoPostal)
            throw new Error("Código postal requerido");
    }
}
exports.Direccion = Direccion;
//# sourceMappingURL=Direccion.js.map