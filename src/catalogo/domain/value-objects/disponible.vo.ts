export class Disponible {
  private readonly value: boolean;

  private constructor(value: boolean) {
    this.value = value;
  }

  public static creaDisponible(): Disponible {
    return new Disponible(true);
  }

  public static creaNoDisponible(): Disponible {
    return new Disponible(false);
  }

  public estaDisponible(): boolean {
    return this.value;
  }
}
