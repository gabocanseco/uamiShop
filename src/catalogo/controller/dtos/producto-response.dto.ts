export class ProductoResponseDto {
  id!: string;
  nombre!: string;
  descripcion!: string;
  precio!: number;
  categoriaId!: string;
  disponible!: boolean;
  fechaCreacion!: Date;
  imagenes!: {
    id: string;
    url: string;
    alt: string;
    orden: number;
  }[];
}
