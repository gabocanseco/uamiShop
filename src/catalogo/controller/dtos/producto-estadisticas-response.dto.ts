import { ApiProperty } from '@nestjs/swagger';

export class ProductoEstadisticasResponseDto {
  @ApiProperty({ description: 'ID del producto', format: 'uuid' })
  productoId!: string;

  @ApiProperty({ description: 'Número de transacciones de venta' })
  ventasTotales!: number;

  @ApiProperty({ description: 'Unidades vendidas' })
  cantidadVendida!: number;

  @ApiProperty({ description: 'Veces agregado al carrito' })
  vecesAgregadAlCarrito!: number;

  @ApiProperty({ description: 'Fecha de la última venta' })
  ultimaVentaAt!: Date;

  @ApiProperty({ description: 'Fecha de la última vez agregado al carrito' })
  ultimaAgregadoAlCarritoAt!: Date;
}
