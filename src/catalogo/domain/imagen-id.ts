import {v4 as uuidv4} from 'uuid';

export class ImagenId {
    private readonly valor: string;

    private constructor(valor: string) {
        this.valor = valor
    }

    public static generar(): ImagenId {
        return new ImagenId(uuidv4())
    }

    /**
     * Cargar un uuid
     * @param id - uuid
     * @returns Devuelve ImagenId con el uuid cargado
     */
    public of(id: string): ImagenId {
        return new ImagenId(id)
    }

    public getValue(): string {
        return this.valor
    }
}