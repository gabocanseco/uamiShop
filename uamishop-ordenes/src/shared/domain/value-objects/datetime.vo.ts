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
  //Agregar dias a la fecha
  public addDays(days: number): DateTime {
    const newDate = new Date(this.valor);
    newDate.setDate(newDate.getDate() + days);
    return new DateTime(newDate);
  }
}
