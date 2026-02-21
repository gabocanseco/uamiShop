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
  productoId!: string;

  @IsString({ message: 'El nombre de producto debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de producto es obligatorio' })
  nombreProducto!: string;

  @IsString({ message: 'El sku debe ser una cadena' })
  @IsNotEmpty({ message: 'El sku es obligatorio' })
  sku!: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'La cantidad es obligatoria' })
  cantidad!: number;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty({ message: 'El precio unitario es obligatorio' })
  precioUnitario!: number;
}

export class DireccionEnvioDto {
  @IsString({ message: 'El nombre de destinatario debe ser una cadena' })
  @IsNotEmpty({ message: 'El nombre de destinatario es obligatorio' })
  nombreDestinatario!: string;

  @IsString({ message: 'La calle de debe ser una cadena' })
  @IsNotEmpty({ message: 'La calle es obligatoria' })
  calle!: string;

  @IsString({ message: 'La ciudad de debe ser una cadena' })
  @IsNotEmpty({ message: 'La ciudad es obligatoria' })
  ciudad!: string;

  @IsString({ message: 'El estado de debe ser una cadena' })
  @IsNotEmpty({ message: 'El estado es obligatorio' })
  estado!: string;

  @IsString({ message: 'El codigo postal de debe ser una cadena' })
  @IsNotEmpty({ message: 'El codigo opstal es obligatorio' })
  codigoPostal!: string;

  @IsString({ message: 'El pais de debe ser una cadena' })
  @IsNotEmpty({ message: 'El pais es obligatorio' })
  pais!: string;

  @IsString({ message: 'El telefono de debe ser una cadena' })
  @IsNotEmpty({ message: 'El telefono es obligatorio' })
  telefono!: string;

  @IsString({ message: 'Las instrucciones debe ser una cadena' })
  @IsNotEmpty({ message: 'Las instrucciones son obligatorias' })
  instrucciones!: string;
}

export class ResumenPagoDto {
  @IsString({ message: 'El metodo de pago debe ser una cadena' })
  @IsNotEmpty({ message: 'El método de pago es obligatorio' })
  metodoPago!: string;
}

export class ReferenciaExternaDto {
  @IsString({ message: 'La referencia externa debe ser una cadena' })
  @IsNotEmpty({ message: 'La referencia externa es obligatorio' })
  referenciaExterna!: string;
}

export class InfoEnvioDto {
  @IsString({ message: 'El proveedor logistico debe ser una cadena' })
  @IsNotEmpty({ message: 'El proveedor logistico es obligatorio' })
  proveedorLogistico!: string;

  @IsString({ message: 'El número de guia debe ser una cadena' })
  @IsNotEmpty({ message: 'El número de guía es obligatorio' })
  numeroGuia!: string;

  @IsNotEmpty({ message: 'La fecha estimada de entrega es obligatorio' })
  @IsDate({ message: 'La fecha estimada de entrega debe ser de tipo ' })
  @Type(() => Date)
  fechaEstimadaEntrega!: Date;
}

export class MotivoDto {
  @IsString({ message: 'El motivo debe ser una cadena' })
  @IsNotEmpty({ message: 'El motivo es obligatorio' })
  motivo!: string;
}

export class OrdenRequestDto {
  @IsNotEmpty({ message: 'El id del cliente es obligatorio' })
  @IsUUID('4', { message: 'El ID debe ser un UUID válido versión 4' })
  clienteId!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemOrdenDto)
  items!: ItemOrdenDto[];

  @ValidateNested()
  @Type(() => DireccionEnvioDto)
  direccion!: DireccionEnvioDto;

  @ValidateNested()
  @Type(() => ResumenPagoDto)
  resumenPago!: ResumenPagoDto;
}

export class OrdenDesdeCarritoDto {
  @ValidateNested()
  @Type(() => DireccionEnvioDto)
  direccionEnvio!: DireccionEnvioDto;

  @ValidateNested()
  @Type(() => ResumenPagoDto)
  resumenPago!: ResumenPagoDto;
}
