import { BusinessRuleException } from '@app/shared/domain/exceptions/business-rule.exception';

export class NombreProducto {
  private readonly valor: string;

  private constructor(valor: string) {
    this.valor = valor;
  }

  public getValue(): string {
    return this.valor;
  }

  public static crear(valor: string): NombreProducto {
    const MIN_NUM_CHARS = 3;
    const MAX_NUM_CHARS = 100;
    const longitudValor = valor.length;
    if (longitudValor < MIN_NUM_CHARS || longitudValor > MAX_NUM_CHARS) {
      throw new BusinessRuleException(
        `El nombre es inválido. Debe tener entre 3 y 100 caracteres.`,
      );
    }

    return new NombreProducto(valor);
  }
}
