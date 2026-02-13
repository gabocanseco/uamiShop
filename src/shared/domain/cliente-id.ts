import { v4 as uuidv4 } from 'uuid';

export class ClienteId {
    private readonly valor: string;

    private constructor(valor: string) {
        this.valor = valor
    }

    public static generar(): ClienteId {
        return new ClienteId(uuidv4())
    }

    public of(id: string): ClienteId {
        return new ClienteId(id)
    }

    public getValue(): string {
        return this.valor
    }
}
