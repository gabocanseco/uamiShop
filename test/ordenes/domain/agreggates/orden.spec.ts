import {OrdenException} from "@ordenes/domain/exception/orden-exception";
import {Orden} from "@ordenes/domain/agreggates/orden";
import {ClienteId} from "@shared/domain/cliente-id";
import {DireccionEnvio} from "@shared/domain/direccion-envio";
import {ResumenPago} from "@ordenes/domain/value_objects/resumen-pago";
import {ItemOrden} from "@ordenes/domain/entities/item-orden";
import {ProductoId} from "@shared/domain/producto-id";
import {Money} from "@shared/domain/money";
import {DomainException} from "@shared/exception/domain-exception";

describe('Orden Agreggate Root', () => {
    describe('Crear orden', () => {
        it('Una orden debe tener al menos un item', () => {
            const clienteId = ClienteId.generar()
            const direccionEnvio = DireccionEnvio.crear(
                "nombre",
                "calle",
                "ciudad",
                "estado",
                "12345",
                "pais",
                "1122334455",
                "instrucciones"
            )
            const resumenPago = ResumenPago.crear("Tarjeta")

            const itemsInvalidos: ItemOrden[] = []

            expect(() => {
                Orden.crear(
                    clienteId,
                    itemsInvalidos,
                    direccionEnvio,
                    resumenPago
                )
            }).toThrow(OrdenException);
        });

        it('El total de la orden debe ser mayor a cero', () => {
            const clienteId = ClienteId.generar();
            const direccionEnvio = DireccionEnvio.crear(
                "nombre",
                "calle",
                "ciudad",
                "estado",
                "12345",
                "pais",
                "1122334455",
                "instrucciones"
            );
            const resumenPago = ResumenPago.crear("Tarjeta");

            const itemOrden = ItemOrden.crear(
                ProductoId.generar(),
                "Mi Producto",
                "sku-1",
                1,
                Money.cero('MXN')
            );
            const itemsInvalidos: ItemOrden[] = [itemOrden];

            expect(() => {
                Orden.crear(
                    clienteId,
                    itemsInvalidos,
                    direccionEnvio,
                    resumenPago
                )
            }).toThrow(OrdenException);
        });
    });
});
