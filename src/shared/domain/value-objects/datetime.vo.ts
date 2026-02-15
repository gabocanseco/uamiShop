export class DateTime {
  private readonly valor: Date;

  private constructor(valor: Date) {
    this.valor = valor;
  }

  public getValue(): Date {
    return this.valor;
  }

  public static now(): DateTime {
    return new DateTime(new Date());
  }
}
