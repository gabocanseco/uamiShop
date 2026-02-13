import { v4 as uuidv4 } from 'uuid';

export class ProductoId {
    private readonly valor: string;

    private constructor(valor: string) {
        this.valor = valor
    }

    public static generar(): ProductoId {
        return new ProductoId(uuidv4())
    }

    /**
     * Cargar un uuid
     * @param id - uuid
     * @returns Devuelve ProductoId con el uuid cargado
     */
    public of(id: string) : ProductoId {
        return new ProductoId(id)
    }

    public getValue(): string {
        return this.valor
    }
}