import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';

/**
 * Define la información que serpa expuesta
 */
export class OrdenResponseDto {
  id!: string;
  numeroOrden!: string;
  clienteId!: string;
  items!: object;
  direccionEnvio!: object;
  resumenPago!: object;
  subtotal!: object;
  descuento!: object;
  total!: object;
  estado!: string;
  fechaCreacion!: Date;
  historialEstados!: object;
  infoEnvio?: object;

  public static fromDomain(orden: Orden): OrdenResponseDto {
    const ordenPrimitivos = orden.toPrimitives();

    const response = new OrdenResponseDto();
    response.id = ordenPrimitivos.id;
    response.numeroOrden = ordenPrimitivos.numeroOrden;
    response.clienteId = ordenPrimitivos.clienteId;
    response.items = ordenPrimitivos.items;
    response.direccionEnvio = ordenPrimitivos.direccionEnvio;
    response.resumenPago = ordenPrimitivos.resumenPago;
    response.subtotal = ordenPrimitivos.subtotal;
    response.descuento = ordenPrimitivos.descuento;
    response.total = ordenPrimitivos.total;
    response.estado = ordenPrimitivos.estado;
    response.fechaCreacion = ordenPrimitivos.fechaCreacion;
    response.historialEstados = ordenPrimitivos.historialEstados;
    response.infoEnvio = ordenPrimitivos.infoEnvio;
    return response;
  }
}
