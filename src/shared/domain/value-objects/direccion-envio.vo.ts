import { DomainException } from '@shared/domain/exceptions/domain.exception';

export class DireccionEnvio {
  private constructor(
    private nombreDestinatario: string,
    private calle: string,
    private ciudad: string,
    private estado: string,
    private codigoPostal: string,
    private pais: string,
    private telefono: string,
    private instrucciones: string,
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
}
