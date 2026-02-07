import {v4 as uuidv4} from 'uuid';

export class CategoriaId{
    private readonly valor: string;

    private constructor(valor: string) {
        this.valor = valor
    }

    public static generar(): CategoriaId {
        return new CategoriaId(uuidv4())
    }

    /**
     * Cargar un uuid
     * @param id - uuid
     * @returns Devuelve ImagenId con el uuid cargado
     */
    public of(id: string): CategoriaId {
        return new CategoriaId(id)
    }

    public getValue(): string {
        return this.valor
    }
}