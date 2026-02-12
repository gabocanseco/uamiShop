import validator from 'validator';

export class Email {
  private constructor(private readonly _valor: string) {}

  public static crear(email: string): Email {
    if (!Email.esValido(email)) {
      throw new Error(`Email inválido: ${email}`);
    }
    return new Email(email.toLowerCase().trim()); // Normalizamos
  }

  // Validación del email
  private static esValido(email: string): boolean {
    if (!email || typeof email !== 'string') {
      return false;
    }
    
    return validator.isEmail(email, {
      allow_utf8_local_part: false,
      require_tld: true,
      allow_ip_domain: false,
      domain_specific_validation: true
    });
  }

  public get valor(): string {
    return this._valor;
  }

  // Obtener el dominio del email
  public get dominio(): string {
    return this._valor.split('@')[1];
  }

  // Obtener el usuario del email
  public get usuario(): string {
    return this._valor.split('@')[0];
  }

  // Comparación de emails
  public esIgual(otro: Email): boolean {
    return this._valor === otro._valor;
  }

  public static validar(email: string): boolean {
    return this.esValido(email);
  }


  public toString(): string {
    return this._valor;
  }
}