import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class DireccionEnvio {
  private constructor(
    private readonly nombreDestinatario: string,
    private readonly calle: string,
    private readonly ciudad: string,
    private readonly estado: string,
    private readonly codigoPostal: string,
    private readonly pais: string,
    private readonly telefono: string,
    private readonly instrucciones: string,
  ) {
    this.nombreDestinatario = nombreDestinatario;
    this.calle = calle;
    this.ciudad = ciudad;
    this.estado = estado;
    this.codigoPostal = codigoPostal;
    this.pais = pais;
    this.telefono = telefono;
    this.instrucciones = instrucciones;
  }

  public static crear(
    nombreDestinatario: string,
    calle: string,
    ciudad: string,
    estado: string,
    codigoPostal: string,
    pais: string,
    telefono: string,
    instrucciones: string,
  ): DireccionEnvio {
    const codigoPostalRegex = /^\d{5}$/;
    if (!codigoPostalRegex.test(codigoPostal)) {
      throw new DomainException(
        'La dirección de envio debe tener código postal válido (5 digitos)',
      );
    }

    const telefonoContactoRegex = /^\d{10}$/;
    if (!telefonoContactoRegex.test(telefono)) {
      throw new DomainException(
        'El teléfono de contacto debe tener 10 digitos)',
      );
    }

    return new DireccionEnvio(
      nombreDestinatario,
      calle,
      ciudad,
      estado,
      codigoPostal,
      pais,
      telefono,
      instrucciones,
    );
  }

  public formatear(): string {
    return '';
  }

  public toPrimitives() {
    return {
      nombreDestinatario: this.nombreDestinatario,
      calle: this.calle,
      ciudad: this.ciudad,
      estado: this.estado,
      codigoPostal: this.codigoPostal,
      pais: this.pais,
      telefono: this.telefono,
      instrucciones: this.instrucciones,
    };
  }
}
