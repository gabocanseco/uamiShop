import { v4 as uuidv4 } from 'uuid';

export class OrdenId {
    private readonly valor: string;

    private constructor(valor: string) {
        this.valor = valor
    }

    public static generar(): OrdenId {
        return new OrdenId(uuidv4())
    }

    public getValue(): string {
        return this.valor
    }
}