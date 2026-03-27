import { CarritoId } from '@app/shared/domain/value-objects/ids/carrito-id.vo';
import { CarritoResumenDto } from '../dtos/carrito-resumen.dto';

/**
 * Contrato para poder generar una nueva orden desde un carrito sin conocer entidades de dominio del carrito
 */
export interface VentasApi {
  obtenerResumenCarrito(carritoId: CarritoId): Promise<CarritoResumenDto>;
}
