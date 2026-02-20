import { Carrito } from '@ventas/domain/agreggates/carrito';
import { EstadoCarrito } from '@ventas/domain/enums/estado-carrito.enum';

interface DescuentoPrimitivo {
  codigo: string;
  tipo: string;
  valor: number;
  montoDescontado: {
    cantidad: number;
    moneda: string;
  };
}

export class CarritoResponseDto {
  id: string;
  clienteId: string;
  items: {
    id: string;
    productoRef: {
      productoId: string;
      nombreProducto: string;
      sku: string;
    };
    cantidad: number;
    precioUnitario: {
      cantidad: number;
      moneda: string;
    };
  }[];
  descuentos: DescuentoPrimitivo[];
  estado: EstadoCarrito;
  subtotal: {
    cantidad: number;
    moneda: string;
  };
  total: {
    cantidad: number;
    moneda: string;
  };
  cantidadItems: number;
  fechaCreacion: Date;
  fechaActualizacion: Date;
  

  static fromDomain(carrito: Carrito): CarritoResponseDto {
    const primitives = carrito.toPrimitives();
    const subtotal = carrito.calcularSubtotal();
    const total = carrito.calcularTotal();

    const dto = new CarritoResponseDto();
    dto.id = primitives.id;
    dto.clienteId = primitives.clienteId;
    dto.items = primitives.items;
    dto.descuentos = primitives.descuentos;
    dto.estado = primitives.estado;
    dto.subtotal = subtotal.toPrimitives();
    dto.total = total.toPrimitives();
    dto.cantidadItems = carrito.obtenerCantidadItems();
    dto.fechaCreacion = primitives.fechaCreacion;
    dto.fechaActualizacion = primitives.fechaActualizacion;

    return dto;
  }
}
