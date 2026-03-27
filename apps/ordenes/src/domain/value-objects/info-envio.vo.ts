import { BusinessRuleException } from '@app/shared';
import { DateTime } from '@app/shared/domain/value-objects/datetime.vo';

export class InfoEnvio {
  private constructor(
    private readonly proveedorLogistico: string,
    private readonly numeroGuia: string,
    private readonly fechaEtimadaEntrega: DateTime,
  ) {}

  public static crear(
    proveedorLogistico: string,
    numeroGuia: string,
    fechaEtimadaEntrega: DateTime,
  ): InfoEnvio {
    if (!numeroGuia || numeroGuia.trim().length === 0) {
      throw new BusinessRuleException(
        `Debe proporcionarse el número de gui del envio`,
      );
    }

    const MIN_NUM_CHARS = 10;
    if (numeroGuia.length < MIN_NUM_CHARS) {
      throw new BusinessRuleException(
        `El número de guia debe tener al menos 10 caracteres`,
      );
    }

    return new InfoEnvio(proveedorLogistico, numeroGuia, fechaEtimadaEntrega);
  }

  public getProveedorLogistico(): string {
    return this.proveedorLogistico;
  }
  public getNumeroGuia(): string {
    return this.numeroGuia;
  }
  public getFechaEtimadaEntrega(): DateTime {
    return this.fechaEtimadaEntrega;
  }

  static reconstruct(props: {
    proveedorLogistico: string;
    numeroGuia: string;
    fechaEtimadaEntrega: DateTime;
  }): InfoEnvio {
    return new InfoEnvio(
      props.proveedorLogistico,
      props.numeroGuia,
      props.fechaEtimadaEntrega,
    );
  }

  public toPrimitives() {
    return {
      proveedorLogistico: this.proveedorLogistico,
      numeroGuia: this.numeroGuia,
      fechaEtimadaEntrega: this.fechaEtimadaEntrega.getValue(),
    };
  }
}
