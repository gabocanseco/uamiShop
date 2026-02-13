import {Money} from "@shared/domain/money";
import {ItemOrdenId} from "@ordenes/domain/value_objects/item-orden-id";
import {ProductoId} from "@shared/domain/producto-id";

export class ItemOrden {
    private constructor(
        private id: ItemOrdenId,
        private productoId: ProductoId,
        private nombreProducto: string,
        private sku: string,
        private cantidad: number,
        private precioUnitario: Money,
        private subtotal: Money
    ) {
        this.id = id;
        this.productoId = productoId;
        this.nombreProducto = nombreProducto;
        this.sku = sku;
        this.cantidad = cantidad;
        this.precioUnitario = precioUnitario;
        this.subtotal = subtotal;
    }

    public static crear(
        productoId: ProductoId,
        nombreProducto: string,
        sku: string,
        cantidad: number,
        precioUnitario: Money
    ): ItemOrden {
        const subtotal = precioUnitario.multiplicar(cantidad);
        return new ItemOrden(
            ItemOrdenId.generar(),
            productoId,
            nombreProducto,
            sku,
            cantidad,
            precioUnitario,
            subtotal
        );
    }

    public calcularSubtotal(): Money {
        const nuevoSubtotal = this.precioUnitario.multiplicar(this.cantidad);
        this.subtotal = nuevoSubtotal
        return nuevoSubtotal;
    }
}