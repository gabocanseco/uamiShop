import { OrdenId } from '@ordenes/domain/value-objects/ids/orden-id.vo';
import { OrdenResumenDto } from '@ordenes/api/dtos/orden-resumen.dto';

/**
 * Contrato que expone órdenes hacia otros bounded contexts
 */
export interface OrdenesApi {
  // obtenerResumenOrden(ordenId: OrdenId): Promise<OrdenResumenDto>;
}
