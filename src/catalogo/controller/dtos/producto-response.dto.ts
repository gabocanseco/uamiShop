import { ApiProperty } from "@nestjs/swagger";
export class ProductoResponseDto {
  @ApiProperty({
    description: 'ID único del producto',
    example: '550e8400-e29b-41d4-a716-446655440020',
    format: 'uuid',
    
  })
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
