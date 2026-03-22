import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { OrdenResumenDto } from '@ordenes/api/dtos/orden-resumen.dto';

export class OrdenesApiMapper {
  public static ordenToOrdenResumenDto(orden: Orden): OrdenResumenDto {
    const primitives = orden.toPrimitives();

    return {
      ordenId: primitives.id,
      numeroOrden: primitives.numeroOrden,
      clienteId: primitives.clienteId,
      items: primitives.items.map((item) => ({
        productoId: item.productoId,
        nombreProducto: item.nombreProducto,
        sku: item.sku,
        cantidad: item.cantidad,
        precioUnitario: item.precioUnitario,
        subtotal: item.subtotal,
      })),
      subtotal: primitives.subtotal,
      descuento: primitives.descuento,
      total: primitives.total,
      estado: primitives.estado,
      fechaCreacion: primitives.fechaCreacion,
    };
  }
}
