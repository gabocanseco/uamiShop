import { parsePhoneNumberFromString, CountryCode } from 'libphonenumber-js';
export class Telefono {
  private constructor(private readonly _valor: string) {}

  // Se puede especificar un país por defecto (ej: 'ES' para España)
  public static crear(
    telefono: string, 
    paisPorDefecto?: CountryCode
  ): Telefono {
    if (!Telefono.esValido(telefono, paisPorDefecto)) {
      throw new Error(`Teléfono inválido: ${telefono}`);
    }
    
    // Parsear el número para normalizarlo
    const parsed = parsePhoneNumberFromString(telefono, paisPorDefecto);
    
    // Guardamos en formato internacional (ej: +34123456789)
    return new Telefono(parsed!.number);
  }

  // Validación del teléfono
  private static esValido(
    telefono: string, 
    paisPorDefecto?: CountryCode
  ): boolean {
    if (!telefono || typeof telefono !== 'string') {
      return false;
    }

    const parsed = parsePhoneNumberFromString(telefono, paisPorDefecto);
    return parsed ? parsed.isValid() : false;
  }

  // Getter
  public get valor(): string {
    return this._valor;
  }

  // Obtener el país del teléfono
  public get pais(): string | undefined {
    const parsed = parsePhoneNumberFromString(this._valor);
    return parsed?.country;
  }

  // Formatear el teléfono en formato internacional
  public formatearInternacional(): string {
    const parsed = parsePhoneNumberFromString(this._valor);
    return parsed ? parsed.formatInternational() : this._valor;
  }

  // Formatear el teléfono en formato nacional
  public formatearNacional(): string {
    const parsed = parsePhoneNumberFromString(this._valor);
    return parsed ? parsed.formatNational() : this._valor;
  }

  // Comparación
  public esIgual(otro: Telefono): boolean {
    return this._valor === otro._valor;
  }

  // Método estático para validar sin crear instancia
  public static validar(
    telefono: string, 
    paisPorDefecto?: CountryCode
  ): boolean {
    return this.esValido(telefono, paisPorDefecto);
  }

  // Para serialización
  public toString(): string {
    return this._valor;
  }
}