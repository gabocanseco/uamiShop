import { v4 as uuidv4 } from 'uuid';

export class ItemOrdenId {
    private readonly valor: string;

    private constructor(valor: string) {
        this.valor = valor
    }

    public static generar(): ItemOrdenId {
        return new ItemOrdenId(uuidv4())
    }

    public getValue(): string {
        return this.valor
    }
}
