export class Telefono {
    constructor(public readonly value: string) {
        if (!value) throw new Error("Teléfono requerido");
        if (value.length < 10) {
            throw new Error("Teléfono inválido");
        }
    }
}
