import { ApiProperty } from '@nestjs/swagger';
import { EstadoOrden } from '@ordenes/domain/enums/estado-orden.enum';

/**
 * Define la información que serpa expuesta
 */
export class OrdenResponseDto {
  @ApiProperty({
    description: 'Identificador UUID de la orden',
    type: 'string',
    format: 'uuid',
  })
  id!: string;
  @ApiProperty({
    description: 'Número de orden',
    type: 'string',
  })
  numeroOrden!: string;
  @ApiProperty({
    description: 'Identificador UUID del cliente',
    type: 'string',
    format: 'uuid',
  })
  clienteId!: string;
  @ApiProperty({
    description: 'Lista de items de la orden',
    isArray: true,
  })
  items!: object[];
  @ApiProperty({
    description: 'Dirección de envio de la orden',
  })
  direccionEnvio!: object;
  @ApiProperty({
    description: 'Resumen de pago de la orden',
  })
  resumenPago!: object;
  @ApiProperty({
    description: 'Subtotal de la orden',
  })
  subtotal!: object;
  @ApiProperty({
    description: 'Descuento de la orden',
  })
  descuento!: object;
  @ApiProperty({
    description: 'Precio total de la orden',
  })
  total!: object;
  @ApiProperty({
    description: 'Estado de la orden',
    type: 'string',
  })
  estado!: string;
  @ApiProperty({
    description: 'Fecha de creación de la orden',
  })
  fechaCreacion!: object;
  @ApiProperty({
    description: 'Historial de estados de la orden',
  })
  historialEstados!: object[];
  @ApiProperty({
    description: 'Información de envio de la orden',
  })
  infoEnvio?: object;
}
