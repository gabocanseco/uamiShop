import { BusinessRuleException } from '@app/shared/domain/exceptions/business-rule.exception';

export class DescripcionProducto {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  public getValue(): string {
    return this.valor;
  }

  public static crear(valor: string): DescripcionProducto {
    const MAX_NUM_CHARS = 500;
    const longitudValor = valor.length;
    if (longitudValor > MAX_NUM_CHARS) {
      throw new BusinessRuleException(
        `La descripción no puede exceder 500 caracteres.`,
      );
    }

    return new DescripcionProducto(valor);
  }
}
