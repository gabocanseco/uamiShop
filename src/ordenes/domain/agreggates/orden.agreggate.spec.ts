import { Orden } from '@ordenes/domain/agreggates/orden.agreggate';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { DireccionEnvio } from '@shared/domain/value-objects/direccion-envio.vo';
import { ResumenPago } from '@ordenes/domain/value-objects/resumen-pago.vo';
import { ItemOrden } from '@ordenes/domain/entities/item-orden.entity';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { describe, it, expect } from 'vitest';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';

describe('Orden Agreggate Root', () => {
  describe('Crear orden', () => {
    it('Una orden debe tener al menos un item', () => {
      const clienteId = ClienteId.generar();
      const direccionEnvio = DireccionEnvio.crear(
        'nombre',
        'calle',
        'ciudad',
        'estado',
        '12345',
        'pais',
        '1122334455',
        'instrucciones',
      );
      const resumenPago = ResumenPago.crear('Tarjeta');

      const itemsInvalidos: ItemOrden[] = [];

      expect(() => {
        Orden.crear(clienteId, itemsInvalidos, direccionEnvio, resumenPago);
      }).toThrow(BusinessRuleException);
    });

    it('El total de la orden debe ser mayor a cero', () => {
      const clienteId = ClienteId.generar();
      const direccionEnvio = DireccionEnvio.crear(
        'nombre',
        'calle',
        'ciudad',
        'estado',
        '12345',
        'pais',
        '1122334455',
        'instrucciones',
      );
      const resumenPago = ResumenPago.crear('Tarjeta');

      const itemOrden = ItemOrden.crear(
        ProductoId.generar(),
        'Mi Producto',
        'sku-1',
        1,
        Money.cero('MXN'),
      );
      const itemsInvalidos: ItemOrden[] = [itemOrden];

      expect(() => {
        Orden.crear(clienteId, itemsInvalidos, direccionEnvio, resumenPago);
      }).toThrow(BusinessRuleException);
    });
  });
});
