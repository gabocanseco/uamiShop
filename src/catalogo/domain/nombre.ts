export class Nombre {
    private readonly valor: string;

    constructor(valor: string) {
        this.valor = valor;
    }

    public get longitud() : number {
        return this.valor.length;
    }
}