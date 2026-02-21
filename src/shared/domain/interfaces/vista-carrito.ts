import { CarritoId } from '../value-objects/ids/carrito-id.vo';

/**
 * Contrato para que poder generar una nueva orden desde un carrito sin conocer entidades de dominio del carrito
 */
export interface IVistaCarrito {
  obtenerResumenCarrito(): CarritoResumenData;
}

export interface IVistaCarritoService {
  obtenerResumenCarrito(carritoId: CarritoId): Promise<CarritoResumenData>;
}

export interface ProductoRefResumenData {
  readonly productoId: string;
  readonly nombreProducto: string;
  readonly sku: string;
}

export interface CarritoItemResumenData {
  readonly productoRef: ProductoRefResumenData;
  readonly cantidad: number;
  readonly precioUnitario: number;
}

export interface CarritoResumenData {
  // readonly carritoId: string;
  readonly clienteId: string;
  readonly items: CarritoItemResumenData[];
}
