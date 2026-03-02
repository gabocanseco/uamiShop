import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { ProductoCatalogoDto } from '@catalogo/api/dtos/producto-catalogo.dto';

/**
 * Contrato que expone catálogo hacia otros bounded contexts (ventas, ordenes, etc.)
 */
export interface CatalogoApi {
  obtenerProducto(productoId: ProductoId): Promise<ProductoCatalogoDto>;
}