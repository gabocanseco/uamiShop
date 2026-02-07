import {ImagenId} from "@catalogo/domain/imagen-id";

export class Imagen{
    private readonly id: ImagenId;
    private readonly url: string;
    private readonly altText: string;
    private readonly orden: number;

    private constructor(
        id: ImagenId,
        url: string,
        altText: string,
        orden: number
    ) {
        this.id = id;
        this.url = url;
        this.altText = altText;
        this.orden = orden;
    }

    public static crear(
        id: ImagenId,
        url: string,
        altText: string,
        orden: number
    ) {
        return new Imagen(
            id,
            url,
            altText,
            orden
        );
    }

    public get urlImagen() : string {
        return this.url;
    }
}
