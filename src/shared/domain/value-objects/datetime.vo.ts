export class DateTime {
  private readonly valor: Date;

  private constructor(valor: Date) {
    this.valor = valor;
  }

  public static crear(date: Date) {
    return new DateTime(date);
  }

  public getValue(): Date {
    return this.valor;
  }

  public static now(): DateTime {
    return new DateTime(new Date());
  }
}
