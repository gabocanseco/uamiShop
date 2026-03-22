import { ImagenId } from '@catalogo/domain/value-objects/ids/imagen-id.vo';

export class Imagen {
  private readonly id: ImagenId;
  private readonly url: string;
  private readonly altText: string;
  private readonly orden: number;

  private constructor(
    id: ImagenId,
    url: string,
    altText: string,
    orden: number,
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
    orden: number,
  ) {
    return new Imagen(id, url, altText, orden);
  }

  public getUrl(): string {
    return this.url;
  }

  public getAltText(): string {
    return this.url;
  }

  public getOrden(): number {
    return this.orden;
  }

  public getId(): ImagenId {
    return this.id;
  }
}
