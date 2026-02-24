import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

export class ItemOrdenDto {
  @IsNotEmpty({ message: 'El id del producto es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'f79d6f9e-65c7-4f01-851d-af9be6bce3ab',
    description: 'Identificador UUID del producto',
  })
  productoId!: string;

  @IsString({ message: 'El nombre de producto debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de producto es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Laptop',
    description: 'Nombre del producto',
  })
  nombreProducto!: string;

  @IsString({ message: 'El sku debe ser una cadena' })
  @IsNotEmpty({ message: 'El sku es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'BEH-X1832USB',
    description: 'Sku del producto',
  })
  sku!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  @ApiProperty({
    type: 'number',
    required: true,
    example: '1',
    description: 'Cantidad de unidades del producto',
  })
  cantidad!: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
  @ApiProperty({
    type: 'number',
    required: true,
    example: '7.50',
    description: 'Precio unitario del producto',
  })
  precioUnitario!: number;
}

export class DireccionEnvioDto {
  @IsString({ message: 'El nombre de destinatario debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de destinatario es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Juan Perez',
    description: 'Nombre del destinatario',
  })
  nombreDestinatario!: string;

  @IsString({ message: 'La calle de debe ser una cadena' })
  @IsNotEmpty({ message: 'La calle es obligatoria' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Vasco de Quiroga',
    description: 'Dirección o calle del destinatario',
  })
  calle!: string;

  @IsString({ message: 'La ciudad de debe ser una cadena' })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'CDMX',
    description: 'Ciudad del destinatario',
  })
  ciudad!: string;

  @IsString({ message: 'El estado de debe ser una cadena' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'CDMX',
    description: 'Estado donde recide del destinatario',
  })
  estado!: string;

  @IsString({ message: 'El codigo postal de debe ser una cadena' })
  @IsNotEmpty({ message: 'El codigo opstal es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: '50000',
    description: 'Código portal donde recide del destinatario',
  })
  codigoPostal!: string;

  @IsString({ message: 'El pais de debe ser una cadena' })
  @IsNotEmpty({ message: 'El pais es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'México',
    description: 'Pais donde recide del destinatario',
  })
  pais!: string;

  @IsString({ message: 'El telefono de debe ser una cadena' })
  @IsNotEmpty({ message: 'El telefono es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: '5598436517',
    description: 'Número de teléfono del destinatario',
  })
  telefono!: string;

  @IsString({ message: 'Las instrucciones debe ser una cadena' })
  @IsNotEmpty({ message: 'Las instrucciones son obligatorias' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'La casa es de color blanco',
    description: 'Instrucciones de entrega',
  })
  instrucciones!: string;
}

export class ResumenPagoDto {
  @IsString({ message: 'El metodo de pago debe ser una cadena' })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Tarjeta Débito',
    description: 'Método de pago utilizado',
  })
  metodoPago!: string;
}

export class ReferenciaExternaDto {
  @IsString({ message: 'La referencia externa debe ser una cadena' })
  @IsNotEmpty({ message: 'La referencia externa es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: '1234567',
    description: 'Referencia de pago externa',
  })
  referenciaExterna!: string;
}

export class InfoEnvioDto {
  @IsString({ message: 'El proveedor logistico debe ser una cadena' })
  @IsNotEmpty({ message: 'El proveedor logistico es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'DHL',
    description: 'Nombre del proveedor logístico',
  })
  proveedorLogistico!: string;

  @IsString({ message: 'El número de guia debe ser una cadena' })
  @IsNotEmpty({ message: 'El número de guía es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: '1234567890123456789012',
    description: 'Número de guia para realizar seguimiento de la orden',
  })
  numeroGuia!: string;

  @IsNotEmpty({ message: 'La fecha estimada de entrega es obligatorio' })
  @IsDate({ message: 'La fecha estimada de entrega debe ser una fecha válida' })
  @Type(() => Date)
  @ApiProperty({
    type: 'string',
    required: true,
    example: '2000-09-02',
    description: 'Fecha estimada de entrega de la orden',
  })
  fechaEstimadaEntrega!: Date;
}

export class MotivoDto {
  @IsString({ message: 'El motivo debe ser una cadena' })
  @IsNotEmpty({ message: 'El motivo es obligatorio' })
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'Me equivoque de producto',
    description: 'Motivo de cancelación de la orden',
  })
  motivo!: string;
}

export class OrdenRequestDto {
  @ApiProperty({
    type: 'string',
    required: true,
    example: 'f79d6f9e-65c7-4f01-851d-af9be6bce3ab',
    description: 'Identificador UUID del cliente',
  })
  @IsNotEmpty({ message: 'El id del cliente es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  clienteId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOrdenDto)
  @ApiProperty({
    type: ItemOrdenDto,
    isArray: true,
    required: true,
    description: 'Liste de items para agregar a la orden',
  })
  items!: ItemOrdenDto[];

  @ValidateNested()
  @Type(() => DireccionEnvioDto)
  @ApiProperty({
    type: DireccionEnvioDto,
    required: true,
    description: 'Información de la dirección de envio de la orden',
  })
  direccion!: DireccionEnvioDto;

  @ValidateNested()
  @Type(() => ResumenPagoDto)
  @ApiProperty({
    type: ResumenPagoDto,
    required: true,
    description: 'Resumen de pago de la orden',
  })
  resumenPago!: ResumenPagoDto;
}

export class OrdenDesdeCarritoDto {
  @ValidateNested()
  @Type(() => DireccionEnvioDto)
  @ApiProperty({
    type: DireccionEnvioDto,
    required: true,
    description: 'Dirección de envio de la orden',
  })
  direccionEnvio!: DireccionEnvioDto;

  @ValidateNested()
  @Type(() => ResumenPagoDto)
  @ApiProperty({
    type: ResumenPagoDto,
    required: true,
    description: 'Resumen de pago de la orden',
  })
  resumenPago!: ResumenPagoDto;
}
