export class Direccion {
    constructor(
        public readonly calle: string,
        public readonly numero: number,
        public readonly colonia: string,
        public readonly ciudad: string,
        public readonly codigoPostal: string
    ) {
        if (!calle) throw new Error("Calle requerida");
        if (!numero) throw new Error("Número requerido");
        if (!colonia) throw new Error("Colonia requerida");
        if (!ciudad) throw new Error("Ciudad requerida");
        if (!codigoPostal) throw new Error("Código postal requerido");
    }
}
