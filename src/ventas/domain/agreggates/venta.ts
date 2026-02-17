// NOTE: Las ventas son el equivalente a las ordenes, de eso se encarga el modulo de ordenes
// Cuando se confirma o compra un carrito pasa a ser una orden

// import { Money } from '@shared/domain/value-objects/money.vo';
// import { ItemCarritoId } from '@ventas/domain/value-objects/ids/item-carrito-id.vo';
// import { ClienteId } from '@shared/domain/value-objects/ids/cliente-id.vo';
// import { Estado, EstadoVenta } from '@ventas/domain/value-objects/estado';
// import { Descuento } from '@ventas/domain/value-objects/descuento';
// import { Impuesto } from '@ventas/domain/value-objects/impuesto';
// import { ReferenciaPago } from '@ventas/domain/value-objects/referencia-pago';
// import { NotasVenta } from '@ventas/domain/value-objects/notas-venta';
// import { ItemCarrito } from '@ventas/domain/entities/item-carrito.entity';

// /**
//  * Entidad que representa una venta en el sistema
//  * @param id Identificador único de la venta
//  * @param idCliente Identificador del cliente asociado
//  * @param subtotal Subtotal antes de descuentos e impuestos
//  * @param descuento Descuento aplicado (opcional)
//  * @param impuesto Impuesto aplicado
//  * @param total Total final de la venta
//  * @param estado Estado actual de la venta
//  * @param referenciaPago Referencia de la transacción de pago
//  * @param notas Notas adicionales
//  * @param fecha Fecha de creación de la venta
//  * @param lineaVenta Lineas de la venta
//  *
//  */
// export class Venta {
//   private readonly _lineas: ItemCarrito[];

//   constructor(
//     public readonly id: ItemCarritoId,
//     public readonly idCliente: ClienteId,
//     public readonly descuento: Descuento,
//     public readonly impuesto: Impuesto,
//     public readonly estado: Estado = Estado.create(EstadoVenta.PENDIENTE),
//     public readonly referenciaPago?: ReferenciaPago,
//     public readonly notas: NotasVenta = NotasVenta.vacia(),
//     public readonly fecha: Date = new Date(),
//     lineas: ItemCarrito[] = [],
//   ) {
//     if (lineas.length === 0) {
//       throw new Error('La venta debe tener al menos una línea');
//     }
//     this._lineas = [...lineas];
//     this.validar();
//   }

//   /**
//    * Valida la integridad de la venta
//    */
//   private validar(): void {
//     if (this.total.lessThanOrEqual(Money.cero())) {
//       throw new Error('El total de la venta debe ser mayor a 0');
//     }

//     // Verificar moneda consistente en todas las líneas
//     const moneda = this._lineas[0].precioUnitario.codigoMoneda;
//     const todasMismaMoneda = this._lineas.every(
//       (linea) => linea.precioUnitario.codigoMoneda === moneda,
//     );

//     if (!todasMismaMoneda) {
//       throw new Error('Todas las líneas deben usar la misma moneda');
//     }
//   }

//   /**
//    * Calcula el total a partir de las líneas
//    */
//   private get totalCalculado(): Money {
//     const subtotal = this.subtotal;
//     let montoDescuento: Money;

//     if (this.descuento.monto && this.descuento.monto.getCantidad() > 0) {
//       montoDescuento = this.descuento.monto;
//     } else {
//       montoDescuento = subtotal.multiplicar(this.descuento.porcentaje / 100);
//     }

//     const totalConDescuento = subtotal.restar(montoDescuento);
//     return totalConDescuento.sumar(this.impuesto.monto);
//   }

//   private recalcularImpuesto(nuevoSubtotal: Money): Impuesto {
//     if (this.impuesto.porcentaje > 0) {
//       // Calcular descuento proporcional para la base imponible si es necesario
//       // En este modelo simple, asumimos que el impuesto se calcula sobre el subtotal tras descuento?
//       // O sobre subtotal bruto? Depende de la regla de negocio.
//       // Generalmente IVA es sobre el total tras descuentos.

//       let montoDescuento: Money;
//       if (this.descuento.monto && this.descuento.monto.getCantidad() > 0) {
//         montoDescuento = this.descuento.monto;
//       } else {
//         montoDescuento = nuevoSubtotal.multiplicar(
//           this.descuento.porcentaje / 100,
//         );
//       }

//       const baseImponible = nuevoSubtotal.restar(montoDescuento);
//       const nuevoMontoImpuesto = baseImponible.multiplicar(
//         this.impuesto.porcentaje / 100,
//       );
//       return Impuesto.create(this.impuesto.porcentaje, nuevoMontoImpuesto);
//     }
//     return this.impuesto;
//   }

//   /**
//    * Obtiene el subtotal sumando todas las líneas
//    */
//   get subtotal(): Money {
//     return this._lineas.reduce(
//       (acc, linea) => acc.sumar(linea.total),
//       Money.cero(this._lineas[0]?.precioUnitario.codigoMoneda || 'MXN'),
//     );
//   }

//   /**
//    * Obtiene el total de la venta
//    */
//   get total(): Money {
//     return this.totalCalculado;
//   }

//   /**
//    * Obtiene una copia inmutable de las líneas
//    */
//   get lineas(): ItemCarrito[] {
//     return [...this._lineas];
//   }

//   /**
//    * Obtiene el número de líneas
//    */
//   get cantidadLineas(): number {
//     return this._lineas.length;
//   }

//   /**
//    * Crea una nueva venta
//    */
//   static crear(
//     lineas: ItemCarrito[],
//     clienteId: ClienteId,
//     descuento?: Descuento,
//     impuesto?: Impuesto,
//     referenciaPago?: ReferenciaPago,
//     notas?: NotasVenta,
//   ): Venta {
//     return new Venta(
//       ItemCarritoId.create(),
//       clienteId,
//       descuento ?? Descuento.sin(),
//       impuesto ?? Impuesto.cero(),
//       Estado.create(EstadoVenta.PENDIENTE),
//       referenciaPago,
//       notas ?? NotasVenta.vacia(),
//       new Date(),
//       lineas,
//     );
//   }

//   /**
//    * Agrega una línea a la venta
//    */
//   agregarLinea(linea: ItemCarrito): Venta {
//     // Validar moneda consistente
//     if (this._lineas.length > 0) {
//       const monedaActual = this._lineas[0].precioUnitario.codigoMoneda;
//       if (linea.precioUnitario.codigoMoneda !== monedaActual) {
//         throw new Error('No se pueden agregar líneas con diferente moneda');
//       }
//     }

//     const nuevasLineas = [...this._lineas, linea];

//     // Calcular nuevo subtotal para recalcular impuesto
//     const nuevoSubtotal = nuevasLineas.reduce(
//       (acc, l) => acc.sumar(l.total),
//       Money.cero(linea.precioUnitario.codigoMoneda),
//     );
//     const nuevoImpuesto = this.recalcularImpuesto(nuevoSubtotal);

//     return new Venta(
//       this.id,
//       this.idCliente,
//       this.descuento,
//       nuevoImpuesto,
//       this.estado,
//       this.referenciaPago,
//       this.notas,
//       this.fecha,
//       nuevasLineas,
//     );
//   }

//   /**
//    * Elimina una línea de la venta por índice
//    */
//   eliminarLinea(indice: number): Venta {
//     if (indice < 0 || indice >= this._lineas.length) {
//       throw new Error('Índice de línea inválido');
//     }

//     const nuevasLineas = this._lineas.filter((_, i) => i !== indice);

//     // No permitir ventas sin líneas
//     if (nuevasLineas.length === 0) {
//       throw new Error('La venta debe tener al menos una línea');
//     }

//     // Recalcular impuesto
//     const monedaActual = this._lineas[0].precioUnitario.codigoMoneda;
//     const nuevoSubtotal = nuevasLineas.reduce(
//       (acc, l) => acc.sumar(l.total),
//       Money.cero(monedaActual),
//     );
//     const nuevoImpuesto = this.recalcularImpuesto(nuevoSubtotal);

//     return new Venta(
//       this.id,
//       this.idCliente,
//       this.descuento,
//       nuevoImpuesto,
//       this.estado,
//       this.referenciaPago,
//       this.notas,
//       this.fecha,
//       nuevasLineas,
//     );
//   }

//   /**
//    * Actualiza una línea existente
//    */
//   actualizarLinea(indice: number, nuevaLinea: ItemCarrito): Venta {
//     if (indice < 0 || indice >= this._lineas.length) {
//       throw new Error('Índice de línea inválido');
//     }

//     // Validar moneda consistente
//     if (this._lineas.length > 0) {
//       const monedaActual = this._lineas[0].precioUnitario.codigoMoneda;
//       if (nuevaLinea.precioUnitario.codigoMoneda !== monedaActual) {
//         throw new Error('La línea debe usar la misma moneda que la venta');
//       }
//     }

//     const nuevasLineas = [...this._lineas];
//     nuevasLineas[indice] = nuevaLinea;

//     // Recalcular impuesto
//     const nuevoSubtotal = nuevasLineas.reduce(
//       (acc, l) => acc.sumar(l.total),
//       Money.cero(nuevaLinea.precioUnitario.codigoMoneda),
//     );
//     const nuevoImpuesto = this.recalcularImpuesto(nuevoSubtotal);

//     return new Venta(
//       this.id,
//       this.idCliente,
//       this.descuento,
//       nuevoImpuesto,
//       this.estado,
//       this.referenciaPago,
//       this.notas,
//       this.fecha,
//       nuevasLineas,
//     );
//   }

//   /**
//    * Aplica un nuevo descuento
//    */
//   aplicarDescuento(descuento: Descuento): Venta {
//     return new Venta(
//       this.id,
//       this.idCliente,
//       descuento,
//       this.impuesto,
//       this.estado,
//       this.referenciaPago,
//       this.notas,
//       this.fecha,
//       this._lineas,
//     );
//   }

//   /**
//    * Aplica un nuevo impuesto
//    */
//   aplicarImpuesto(impuesto: Impuesto): Venta {
//     return new Venta(
//       this.id,
//       this.idCliente,
//       this.descuento,
//       impuesto,
//       this.estado,
//       this.referenciaPago,
//       this.notas,
//       this.fecha,
//       this._lineas,
//     );
//   }

//   /**
//    * Marca la venta como completada
//    */
//   completar(): Venta {
//     if (!this.estado.isPendiente()) {
//       throw new Error('Solo se pueden completar ventas en estado pendiente');
//     }

//     return new Venta(
//       this.id,
//       this.idCliente,
//       this.descuento,
//       this.impuesto,
//       Estado.create(EstadoVenta.COMPLETADA),
//       this.referenciaPago,
//       this.notas,
//       this.fecha,
//       this._lineas,
//     );
//   }

//   /**
//    * Marca la venta como cancelada
//    */
//   cancelar(): Venta {
//     if (!this.estado.isPendiente()) {
//       throw new Error('Solo se pueden cancelar ventas en estado pendiente');
//     }

//     return new Venta(
//       this.id,
//       this.idCliente,
//       this.descuento,
//       this.impuesto,
//       Estado.create(EstadoVenta.CANCELADA),
//       this.referenciaPago,
//       this.notas,
//       this.fecha,
//       this._lineas,
//     );
//   }

//   /**
//    * Verifica si la venta está completada
//    */
//   estaCompletada(): boolean {
//     return this.estado.isCompletada();
//   }

//   /**
//    * Verifica si la venta está cancelada
//    */
//   estaCancelada(): boolean {
//     return this.estado.isCancelada();
//   }

//   /**
//    * Verifica si la venta está pendiente
//    */
//   estaPendiente(): boolean {
//     return this.estado.isPendiente();
//   }
// }
