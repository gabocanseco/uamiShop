import { DomainException } from '@shared/domain/exceptions/domain.exception';
/**
 * Para reglas de negocio que chocan (Producto ya existe). Devuelve un 409 (conflict)
 */
export class BusinessRuleException extends DomainException {
  constructor(
    public readonly message: string,
    public readonly code?: string, // constantes (PRECIO_NEGATIVO, eetc)
  ) {
    super(message);
    this.name = 'BusinessRuleException';
  }
}
