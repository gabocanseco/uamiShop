import { Carrito } from './carrito.agreggate';
import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
import { ProductoId } from '@shared/domain/value-objects/ids/producto-id.vo';
import { Money } from '@shared/domain/value-objects/money.vo';
import { ProductoRef } from '@ventas/domain/value-objects/producto-ref.vo';
import { Descuento } from '@ventas/domain/value-objects/descuento';
import { TipoDescuento } from '@ventas/domain/enums/tipo-descuento.enum';
import { EstadoCarrito } from '@ventas/domain/enums/estado-carrito.enum';
import { BusinessRuleException } from '@shared/domain/exceptions/business-rule.exception';

function crearProductoRef(nombre = 'Producto Test'): ProductoRef {
  return ProductoRef.crear(
    ProductoId.generar(),
    nombre,
    'SKU-001',
  );
}

function crearCarritoConProducto() {
  const carrito = Carrito.crear(ClienteId.generar());
  const productoRef = crearProductoRef();
  const precio = Money.crear(100);
  carrito.agregarProducto(productoRef, 2, precio);
  return { carrito, productoRef, precio };
}

// --- Tests ---

describe('Carrito Aggregate', () => {
  describe('crear', () => {
    it('debería crear un carrito activo sin items', () => {
      const carrito = Carrito.crear(ClienteId.generar());

      expect(carrito.getEstado()).toBe(EstadoCarrito.ACTIVO);
      expect(carrito.obtenerCantidadItems()).toBe(0);
      expect(carrito.getItems()).toEqual([]);
    });

    it('debería asignar el clienteId correctamente', () => {
      const clienteId = ClienteId.generar();
      const carrito = Carrito.crear(clienteId);

      expect(carrito.getClienteId().getValue()).toBe(clienteId.getValue());
    });
  });

  describe('agregarProducto', () => {
    it('debería agregar un producto nuevo al carrito', () => {
      const carrito = Carrito.crear(ClienteId.generar());
      const productoRef = crearProductoRef();
      const precio = Money.crear(50);

      carrito.agregarProducto(productoRef, 1, precio);

      expect(carrito.obtenerCantidadItems()).toBe(1);
    });

    it('debería incrementar cantidad si el producto ya existe', () => {
      const carrito = Carrito.crear(ClienteId.generar());
      const productoRef = crearProductoRef();
      const precio = Money.crear(50);

      carrito.agregarProducto(productoRef, 1, precio);
      carrito.agregarProducto(productoRef, 3, precio);

      expect(carrito.obtenerCantidadItems()).toBe(1);
      const item = carrito.getItems()[0];
      expect(item.getCantidad()).toBe(4);
    });

    it('debería lanzar excepción al superar 20 productos diferentes', () => {
      const carrito = Carrito.crear(ClienteId.generar());
      const precio = Money.crear(10);

      for (let i = 0; i < 20; i++) {
        carrito.agregarProducto(
          crearProductoRef(`Producto ${i + 1}`),
          1,
          precio,
        );
      }

      expect(() =>
        carrito.agregarProducto(crearProductoRef('Producto 21'), 1, precio),
      ).toThrow(BusinessRuleException);
    });
  });

  describe('modificarCantidad', () => {
    it('debería actualizar la cantidad de un producto existente', () => {
      const { carrito, productoRef } = crearCarritoConProducto();
      const productoId = productoRef.getProductoId();

      carrito.modificarCantidad(productoId, 5);

      const item = carrito.getItems()[0];
      expect(item.getCantidad()).toBe(5);
    });

    it('debería eliminar el producto si la nueva cantidad es menor a 1', () => {
      const { carrito, productoRef } = crearCarritoConProducto();
      const productoId = productoRef.getProductoId();

      carrito.modificarCantidad(productoId, 0);

      expect(carrito.obtenerCantidadItems()).toBe(0);
    });

    it('debería lanzar excepción si el producto no existe en el carrito', () => {
      const carrito = Carrito.crear(ClienteId.generar());

      expect(() => carrito.modificarCantidad(ProductoId.generar(), 2)).toThrow(
        'Producto no encontrado en el carrito',
      );
    });

    it('debería lanzar excepción si el carrito está en checkout', () => {
      const { carrito, productoRef } = crearCarritoConProducto();
      carrito.iniciarCheckout();

      expect(() =>
        carrito.modificarCantidad(productoRef.getProductoId(), 5),
      ).toThrow(
        'No se puede modificar la cantidad si el carrito está en checkout',
      );
    });
  });

  describe('eliminarProducto', () => {
    it('debería eliminar un producto existente del carrito', () => {
      const { carrito, productoRef } = crearCarritoConProducto();

      carrito.eliminarProducto(productoRef.getProductoId());

      expect(carrito.obtenerCantidadItems()).toBe(0);
    });

    it('debería lanzar excepción si el producto no existe', () => {
      const carrito = Carrito.crear(ClienteId.generar());

      expect(() => carrito.eliminarProducto(ProductoId.generar())).toThrow(
        'Debe existir el producto en el carrito para poder eliminarlo',
      );
    });

    it('debería lanzar excepción si el carrito está en checkout', () => {
      const { carrito, productoRef } = crearCarritoConProducto();
      carrito.iniciarCheckout();

      expect(() =>
        carrito.eliminarProducto(productoRef.getProductoId()),
      ).toThrow(
        'No se puede eliminar un producto si el carrito está en checkout',
      );
    });
  });

  describe('vaciar', () => {
    it('debería eliminar todos los items del carrito', () => {
      const { carrito } = crearCarritoConProducto();

      carrito.vaciar();

      expect(carrito.obtenerCantidadItems()).toBe(0);
    });

    it('debería lanzar excepción si el carrito está en checkout', () => {
      const { carrito } = crearCarritoConProducto();
      carrito.iniciarCheckout();

      expect(() => carrito.vaciar()).toThrow(
        'No se puede vaciar un carrito que está en checkout',
      );
    });
  });

  describe('calcularSubtotal', () => {
    it('debería devolver cero si el carrito está vacío', () => {
      const carrito = Carrito.crear(ClienteId.generar());

      const subtotal = carrito.calcularSubtotal();

      expect(subtotal.isZero()).toBe(true);
    });

    it('debería calcular el subtotal correctamente', () => {
      const carrito = Carrito.crear(ClienteId.generar());
      // 2 × $100 = $200
      carrito.agregarProducto(
        crearProductoRef('Producto A'),
        2,
        Money.crear(100),
      );
      // 3 × $50 = $150
      carrito.agregarProducto(
        crearProductoRef('Producto B'),
        3,
        Money.crear(50),
      );

      const subtotal = carrito.calcularSubtotal();

      expect(subtotal.getCantidad()).toBe(350);
    });
  });

  describe('calcularTotal con descuentos', () => {
    it('debería aplicar descuento porcentual al total', () => {
      const carrito = Carrito.crear(ClienteId.generar());
      carrito.agregarProducto(crearProductoRef(), 1, Money.crear(200));

      const descuento = Descuento.crear('DESC10', TipoDescuento.PORCENTAJE, 10);
      carrito.aplicarDescuento(descuento);

      const total = carrito.calcularTotal();

      // $200 - 10% = $180
      expect(total.getCantidad()).toBe(180);
    });

    it('debería devolver subtotal si no hay descuentos', () => {
      const { carrito } = crearCarritoConProducto();

      const total = carrito.calcularTotal();
      const subtotal = carrito.calcularSubtotal();

      expect(total.getCantidad()).toBe(subtotal.getCantidad());
    });
  });

  describe('aplicarDescuento', () => {
    it('debería lanzar excepción si el carrito no está activo', () => {
      const { carrito } = crearCarritoConProducto();
      carrito.iniciarCheckout();

      const descuento = Descuento.crear('DESC10', TipoDescuento.PORCENTAJE, 10);

      expect(() => carrito.aplicarDescuento(descuento)).toThrow(
        'Solo se pueden aplicar descuentos a carritos activos',
      );
    });
  });

  describe('iniciarCheckout', () => {
    it('debería cambiar el estado a EN_CHECKOUT', () => {
      const { carrito } = crearCarritoConProducto();

      carrito.iniciarCheckout();

      expect(carrito.getEstado()).toBe(EstadoCarrito.EN_CHECKOUT);
    });

    it('debería lanzar excepción si el carrito está vacío', () => {
      const carrito = Carrito.crear(ClienteId.generar());

      expect(() => carrito.iniciarCheckout()).toThrow(
        'El carrito debe tener al menos un producto',
      );
    });

    it('debería lanzar excepción si el carrito no está activo', () => {
      const { carrito } = crearCarritoConProducto();
      carrito.iniciarCheckout();

      expect(() => carrito.iniciarCheckout()).toThrow(
        'Solo se puede iniciar el checkout si el carrito está activo',
      );
    });
  });

  describe('completarCheckout', () => {
    it('debería cambiar el estado a COMPLETADO', () => {
      const { carrito } = crearCarritoConProducto();
      carrito.iniciarCheckout();

      carrito.completarCheckout();

      expect(carrito.getEstado()).toBe(EstadoCarrito.COMPLETADO);
    });

    it('debería lanzar excepción si no está en checkout', () => {
      const { carrito } = crearCarritoConProducto();

      expect(() => carrito.completarCheckout()).toThrow(BusinessRuleException);
    });
  });

  describe('abandonar', () => {
    it('debería cambiar el estado a ABANDONADO desde activo', () => {
      const carrito = Carrito.crear(ClienteId.generar());

      carrito.abandonar();

      expect(carrito.getEstado()).toBe(EstadoCarrito.ABANDONADO);
    });

    it('debería cambiar el estado a ABANDONADO desde en checkout', () => {
      const { carrito } = crearCarritoConProducto();
      carrito.iniciarCheckout();

      carrito.abandonar();

      expect(carrito.getEstado()).toBe(EstadoCarrito.ABANDONADO);
    });

    it('debería lanzar excepción si el carrito está completado', () => {
      const { carrito } = crearCarritoConProducto();
      carrito.iniciarCheckout();
      carrito.completarCheckout();

      expect(() => carrito.abandonar()).toThrow(
        'Solo se pueden abandonar carritos activos o en checkout',
      );
    });
  });

  describe('toPrimitives', () => {
    it('debería serializar el carrito correctamente', () => {
      const clienteId = ClienteId.generar();
      const carrito = Carrito.crear(clienteId);

      const primitives = carrito.toPrimitives();

      expect(primitives.clienteId).toBe(clienteId.getValue());
      expect(primitives.estado).toBe(EstadoCarrito.ACTIVO);
      expect(primitives.items).toEqual([]);
      expect(primitives.descuentos).toEqual([]);
      expect(primitives.id).toBeDefined();
      expect(primitives.fechaCreacion).toBeInstanceOf(Date);
      expect(primitives.fechaActualizacion).toBeInstanceOf(Date);
    });
  });
});
