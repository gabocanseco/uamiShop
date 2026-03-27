import { ProductoId } from '@app/shared/domain/value-objects/ids/producto-id.vo';
import { ProductoInfoDto } from '../dtos/producto-info.dto';

/**
 * Contrato que expone catálogo hacia otros bounded contexts (ventas, ordenes, etc.)
 */
export interface CatalogoApi {
  obtenerProducto(productoId: ProductoId): Promise<ProductoInfoDto>;
}
