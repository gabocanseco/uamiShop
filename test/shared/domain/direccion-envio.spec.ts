import {DireccionEnvio} from "@shared/domain/direccion-envio";
import {OrdenException} from "@ordenes/domain/exception/orden-exception";

describe('Direccion Envio Value Object', () => {
    describe('Crear direccion de envio', () => {
        it('El código postal debe estar compuesto por 5 digitos', () => {
            const codigoPostalInvalido = "0a982";
            expect(() => {
                DireccionEnvio.crear(
                    "nombre destinatario",
                    "calle",
                    "ciudad",
                    "estado",
                    codigoPostalInvalido,
                    "pais",
                    "1122334455",
                    "instrucciones"
                )
            }).toThrow(OrdenException);
        });

        it('El teléfono de contacto debe tener 10 dígitos', () => {
            const telefonoInvalido = "11223344556";
            expect(() => {
                DireccionEnvio.crear(
                    "nombre destinatario",
                    "calle",
                    "ciudad",
                    "estado",
                    "12345",
                    "pais",
                    telefonoInvalido,
                    "instrucciones"
                )
            }).toThrow(OrdenException);
        });
    });
});
