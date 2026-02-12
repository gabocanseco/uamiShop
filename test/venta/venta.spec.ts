import { describe, it, expect, beforeEach } from 'vitest';
import { Venta } from 'src/venta/domain/venta';
import { Cantidad } from 'src/venta/domain/value-objects/cantidad';
import { Money } from '@shared/domain/money';
import { Descuento } from 'src/venta/domain/value-objects/descuento';
import { Impuesto } from 'src/venta/domain/value-objects/impuesto';
import { ReferenciaPago } from 'src/venta/domain/value-objects/referencia-pago';
import { NotasVenta } from '../../src/venta/domain/value-objects/notas-venta';
import { EstadoVenta } from 'src/venta/domain/value-objects/estado';

describe('Venta', () => {
  let cantidad: Cantidad;
  let precioUnitario: Money;
  let descuento10: Descuento;
  let impuesto16: Impuesto;

  beforeEach(() => {
    cantidad = new Cantidad(2);
    precioUnitario = Money.crear(100);
    descuento10 = new Descuento(10);
    impuesto16 = Impuesto.create(16, Money.crear(0));
  });

  describe('crear', () => {
    it('debe crear una venta válida con valores básicos', () => {
      const venta = Venta.crear(cantidad, precioUnitario);

      expect(venta.id).toBeDefined();
      expect(venta.cantidad).toBe(cantidad);
      expect(venta.precioUnitario).toBe(precioUnitario);
      expect(venta.estado.value).toBe(EstadoVenta.PENDIENTE);
      expect(venta.fecha).toBeInstanceOf(Date);
    });

    it('debe calcular el subtotal correctamente', () => {
      const venta = Venta.crear(cantidad, precioUnitario);
      expect(venta.subtotal.cantidadDecimal).toBe(200);
    });

    it('debe aplicar descuento porcentual correctamente', () => {
      const venta = Venta.crear(cantidad, precioUnitario, descuento10);
      expect(venta.total.cantidadDecimal).toBe(180);
      expect(venta.descuento.porcentaje).toBe(10);
    });

    it('debe aplicar impuesto correctamente', () => {
      const subtotal = precioUnitario.multiplicar(cantidad.value);
      const montoImpuesto = subtotal.multiplicar(0.16);
      const impuesto = Impuesto.create(16, montoImpuesto);
      
      const venta = Venta.crear(cantidad, precioUnitario, undefined, impuesto);
      expect(venta.total.cantidadDecimal).toBe(232);
      expect(venta.impuesto.porcentaje).toBe(16);
    });

    it('debe crear venta sin descuento cuando no se proporciona', () => {
      const venta = Venta.crear(cantidad, precioUnitario);
      expect(venta.descuento.porcentaje).toBe(0);
    });

    it('debe crear venta con impuesto cero cuando no se proporciona', () => {
      const venta = Venta.crear(cantidad, precioUnitario);
      expect(venta.impuesto.porcentaje).toBe(0);
    });

    it('debe lanzar error si el total es 0 o negativo', () => {
      const descuento100 = new Descuento(100);
      expect(() => {
        Venta.crear(new Cantidad(1), Money.crear(100), descuento100);
      }).toThrow('El total de la venta debe ser mayor a 0');
    });
  });

  describe('completar', () => {
    it('debe cambiar el estado a COMPLETADA', () => {
      const venta = Venta.crear(cantidad, precioUnitario);
      const ventaCompletada = venta.completar();

      expect(ventaCompletada.estado.value).toBe(EstadoVenta.COMPLETADA); 
      expect(ventaCompletada.estaCompletada()).toBe(true);
    });

    it('no se debe modificar la venta original ', () => {
      const venta = Venta.crear(cantidad, precioUnitario);
      const ventaCompletada = venta.completar();

      expect(venta.estado.value).toBe(EstadoVenta.PENDIENTE); 
      expect(venta.estaCompletada()).toBe(false);
      
      expect(ventaCompletada.estado.value).toBe(EstadoVenta.COMPLETADA); 
      expect(ventaCompletada.estaCompletada()).toBe(true);
    });

    it('debe mantener los demás valores sin cambios', () => {
      const venta = Venta.crear(cantidad, precioUnitario, descuento10, impuesto16);
      const ventaCompletada = venta.completar();

      expect(ventaCompletada.id).toBe(venta.id);
      expect(ventaCompletada.total.cantidadDecimal).toBe(venta.total.cantidadDecimal);
      expect(ventaCompletada.cantidad.value).toBe(venta.cantidad.value);
      expect(ventaCompletada.precioUnitario.cantidadDecimal).toBe(venta.precioUnitario.cantidadDecimal);
    });
  });

  describe('cancelar', () => {
    it('debe cambiar el estado a CANCELADA', () => {
      const venta = Venta.crear(cantidad, precioUnitario);
      const ventaCancelada = venta.cancelar();

      expect(ventaCancelada.estado.value).toBe(EstadoVenta.CANCELADA); 
      expect(ventaCancelada.estaCancelada()).toBe(true);
    });

    it('debe mantener la inmutabilidad', () => {
      const venta = Venta.crear(cantidad, precioUnitario);
      const ventaCancelada = venta.cancelar();

      expect(venta.estado.value).toBe(EstadoVenta.PENDIENTE); 
      expect(ventaCancelada.estado.value).toBe(EstadoVenta.CANCELADA); 
    });
  });

  describe('estados', () => {
    it('debe crear venta en estado PENDIENTE por defecto', () => {
      const venta = Venta.crear(cantidad, precioUnitario);

      expect(venta.estado.value).toBe(EstadoVenta.PENDIENTE); 
      expect(venta.estaCompletada()).toBe(false);
      expect(venta.estaCancelada()).toBe(false);
    });

    it('venta completada', () => {
      const venta = Venta.crear(cantidad, precioUnitario).completar();
      expect(venta.estaCompletada()).toBe(true);
      expect(venta.estaCancelada()).toBe(false);
    });

    it('venta cancelada', () => {
      const venta = Venta.crear(cantidad, precioUnitario).cancelar();
      expect(venta.estaCancelada()).toBe(true);
      expect(venta.estaCompletada()).toBe(false);
    });
  });
});