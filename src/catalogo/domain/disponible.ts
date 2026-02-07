export class Disponible{
    private readonly value: boolean;

    constructor(value: boolean) {
        this.value = value;
    }

    public estaDisponible() : boolean {
        return this.value;
    }
}
