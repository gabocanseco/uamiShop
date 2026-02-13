import {ProductoId} from "@shared/domain/producto-id";
import {Nombre} from "./nombre";
import {Descripcion} from "./descripcion";
import {Money} from "@shared/domain/money";
import {CategoriaId} from "./categoria-id";
import {Imagen} from "./imagen";
import {Disponible} from "./disponible";
import {DateTime} from "@shared/domain/datetime";
import {DomainException} from "@shared/exception/domain-exception";

export class Producto {
    private constructor(
        private readonly id: ProductoId,
        private nombre: Nombre,
        private descripcion: Descripcion,
        private precio: Money,
        private categoriaId: CategoriaId,
        private imagenes: Imagen[],
        private disponible: Disponible,
        private fechaCreacion: DateTime
    ) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoriaId = categoriaId;
        this.imagenes = imagenes;
        this.disponible = disponible;
        this.fechaCreacion = fechaCreacion;

    }

    public static crear(
        id: ProductoId,
        nombre: Nombre,
        descripcion: Descripcion,
        precio: Money,
        categoriaId: CategoriaId,
        imagenes: Imagen[],
        disponible: Disponible,
        fechaCreacion: DateTime
    ) {
        const longitudNombre = nombre.longitud
        if (longitudNombre < 3 || longitudNombre > 100) {
            throw new DomainException(
                `El nombre es inválido. Debe tener entre 3 y 100 caracteres.`
            );
        }

        if (precio.cantidadDecimal <= 0) {
            throw new DomainException(
                `El precio debe ser mayor a cero.`
            );
        }

        if (descripcion.longitud > 500) {
            throw new DomainException(
                `La descripción no puede exceder 500 caracteres.`
            );
        }

        return new Producto(
            id,
            nombre,
            descripcion,
            precio,
            categoriaId,
            imagenes,
            disponible,
            fechaCreacion
        );
    }

    public actualizarInformacion(nombre: Nombre, descripcion: Descripcion) : void {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public cambiarPrecio(nuevoPrecio: Money) : void {
        if (nuevoPrecio.cantidadDecimal < 0) {
            throw new DomainException(
                `El nuevo precio no puede ser negativo`
            )
        }

        const porcentaje = 50; // El precio no puede incrementar más del 50%
        const factor = porcentaje / 100;
        const precioConPorcentaje = this.precio.multiplicar(factor);
        if (nuevoPrecio.cantidadDecimal > this.precio.sumar(precioConPorcentaje).cantidadDecimal) {
            throw new DomainException(
                `El precio no puede incrementar más del ${porcentaje}% en un solo cambio`
            )
        }

        this.precio = nuevoPrecio;
    }

    public activar() : void {
        // validar
        if (this.imagenes.length < 1) {
            throw new DomainException(
                `Un producto solo puede activarse si tiene al menos una imagen`
            )
        }

        if (!(this.precio.cantidadDecimal > 0)) {
            throw new DomainException(
                `Un producto solo puede activarse si tiene precio mayor a cero`
            )
        }

        this.disponible = new Disponible(true);
    }

    public desactivar() : void {
        if (!this.disponible.estaDisponible()) {
            throw new DomainException(
                `El producto ya está desactivado, no puede desactivarse nuevamente.`
            )
        }

        this.disponible = new Disponible(false);
    }

    public agregarImagen(imagen: Imagen) : void {
        const limiteImagenes = 5
        if (this.imagenes.length >= limiteImagenes) {
            throw new DomainException(
                `No se pueden agregar más imagenes porque el limte ${limiteImagenes} se ha alcanzado.`
            )
        }

        const regexUrl = /^https?:\/\//;
        if (!regexUrl.test(imagen.urlImagen)) {
            throw new DomainException(
                `La URL de la imagen no es válida.`
            )
        }

        this.imagenes.push(imagen);
    }

    public removerImagen(imagenId: Imagen) : void {

    }
}