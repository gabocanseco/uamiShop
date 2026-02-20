import { DomainException } from '@shared/domain/exceptions/domain.exception';

/**
 * Para cualquier cosa que no exista (Producto, Categoría, Carrito, Orden). Devuelve un 404.
 */
export class EntityNotFoundException extends DomainException {
  constructor(
    public readonly entity: string,
    public readonly id: string | number,
  ) {
    super(`${entity} con ID ${id} no encontrado.`);
    this.name = 'EntityNotFoundException';
  }
}
