export class CrearCarritoDto {
    clienteId: string;
    lineas: {
        productoId: string;
        cantidad: number;
        precioUnitario: number;
        moneda?: string;
    }[];
    descuento?: {
        porcentaje?: number;
        monto?: number;
        moneda?: string;
    };
    impuesto?: {
        porcentaje: number;
        monto?: number;
        moneda?: string;
    };
    referenciaPago?: string;
    notas?: string;
}

export class AgregarProductoDto {
    productoId: string;
    nombreProducto: string;
    sku?: string;
    cantidad: number;
    precioUnitario: number;
    moneda?: string;
}

export class ModificarCantidadDto {
    nuevaCantidad: number;
}

export { CrearCarritoDto as CarritoRequestDto };
