import { Carrito } from '@ventas/domain/agreggates/carrito.agreggate';
import { CarritoResumenDto } from '../dtos/carrito-resumen.dto';

export class VentasApiMapper {
  public static carritoToCarritoResumenDto(
    carrito: Carrito,
  ): CarritoResumenDto {
    return {
      clienteId: carrito.getClienteId().getValue(),
      items: Array.from(carrito.getItems().values()).map((item) => ({
        productoRef: {
          productoId: item.getProductoRef().getProductoId().getValue(),
          nombreProducto: item.getProductoRef().getNombreProducto().getValue(),
          sku: item.getProductoRef().getSku(),
        },
        cantidad: item.getCantidad(),
        precioUnitario: {
          cantidad: item.getPrecioUnitario().getCantidad(),
          moneda: item.getPrecioUnitario().getMoneda(),
        },
      })),
    };
  }
}
