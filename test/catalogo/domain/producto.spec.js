"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const producto_1 = require("@catalogo/domain/producto");
const producto_id_1 = require("@catalogo/domain/producto-id");
const money_1 = require("@shared/domain/money");
const categoria_id_1 = require("@catalogo/domain/categoria-id");
const disponible_1 = require("@catalogo/domain/disponible");
const nombre_1 = require("@catalogo/domain/nombre");
const descripcion_1 = require("@catalogo/domain/descripcion");
const imagen_1 = require("@catalogo/domain/imagen");
const datetime_1 = require("@shared/domain/datetime");
const domain_exception_1 = require("@shared/exception/domain-exception");
const imagen_id_1 = require("@catalogo/domain/imagen-id");
describe('Producto Agreggate', () => {
    describe('Creación', () => {
        it('debería lanzar DomainException si el nombre es muy corto', () => {
            const id = producto_id_1.ProductoId.generar();
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const precio = money_1.Money.crear(10, "MXN");
            const categoriaId = categoria_id_1.CategoriaId.generar();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const fechaCreacion = datetime_1.DateTime.now();
            const nombreInvalido = new nombre_1.Nombre("ab");
            expect(() => {
                producto_1.Producto.crear(id, nombreInvalido, descripcion, precio, categoriaId, imagenes, disponible, fechaCreacion);
            }).toThrow(domain_exception_1.DomainException);
        });
        it('debería lanzar DomainException si el nombre es muy largo', () => {
            const id = producto_id_1.ProductoId.generar();
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const precio = money_1.Money.crear(10, "MXN");
            const categoriaId = categoria_id_1.CategoriaId.generar();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const fechaCreacion = datetime_1.DateTime.now();
            const nombreInvalido = new nombre_1.Nombre("N".repeat(101));
            expect(() => {
                producto_1.Producto.crear(id, nombreInvalido, descripcion, precio, categoriaId, imagenes, disponible, fechaCreacion);
            }).toThrow(domain_exception_1.DomainException);
        });
        it('debería lanzar DomainException si el precio es menor o igual a cero', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("nombre producto");
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const categoriaId = categoria_id_1.CategoriaId.generar();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const fechaCreacion = datetime_1.DateTime.now();
            const precioInvalido = money_1.Money.crear(-1, "MXN");
            expect(() => {
                producto_1.Producto.crear(id, nombre, descripcion, precioInvalido, categoriaId, imagenes, disponible, fechaCreacion);
            }).toThrow(domain_exception_1.DomainException);
        });
        it('debería lanzar DomainException si la descripción excede los 500 caracteres', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("nombre producto");
            const precio = money_1.Money.crear(-1, "MXN");
            const categoriaId = categoria_id_1.CategoriaId.generar();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const fechaCreacion = datetime_1.DateTime.now();
            const descripcionInvalida = new descripcion_1.Descripcion("D".repeat(501));
            expect(() => {
                producto_1.Producto.crear(id, nombre, descripcionInvalida, precio, categoriaId, imagenes, disponible, fechaCreacion);
            }).toThrow(domain_exception_1.DomainException);
        });
    });
    describe('cambiar precio', () => {
        it('debería lanzar domainexception si el nuevo precio es negativo', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("prueba");
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const precio = money_1.Money.crear(10, "MXN");
            const categoriaid = categoria_id_1.CategoriaId.generar();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const fechacreacion = datetime_1.DateTime.now();
            const producto = producto_1.Producto.crear(id, nombre, descripcion, precio, categoriaid, imagenes, disponible, fechacreacion);
            const precioInvalido = money_1.Money.crear(-1, "MXN");
            expect(() => {
                producto.cambiarPrecio(precioInvalido);
            }).toThrow(domain_exception_1.DomainException);
        });
        it('debería lanzar domainexception si el nuevo precio incrementa más del 50% en un solo cambio', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("prueba");
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const precio = money_1.Money.crear(50, "mxn");
            const categoriaid = categoria_id_1.CategoriaId.generar();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const fechacreacion = datetime_1.DateTime.now();
            const producto = producto_1.Producto.crear(id, nombre, descripcion, precio, categoriaid, imagenes, disponible, fechacreacion);
            // Precio con incremento arriba del 50%
            const precioInvalido = money_1.Money.crear(80, "MXN");
            expect(() => {
                producto.cambiarPrecio(precioInvalido);
            }).toThrow(domain_exception_1.DomainException);
        });
    });
    describe('agregar imagen', () => {
        it('debería lanzar DomainException si intenta agregar más de 5 imagenes', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("prueba");
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const precio = money_1.Money.crear(10, "mxn");
            const categoriaid = categoria_id_1.CategoriaId.generar();
            const urls = ["https://img1.png", "https://img2.png", "https://img3.png", "https://img5.png", "https://img5.png"];
            const imagenes = [];
            for (let i = 0; i < urls.length; i++) {
                imagenes.push(imagen_1.Imagen.crear(imagen_id_1.ImagenId.generar(), urls[i], `alt${i + 1}`, i + 1));
            }
            const disponible = new disponible_1.Disponible(true);
            const fechacreacion = datetime_1.DateTime.now();
            const producto = producto_1.Producto.crear(id, nombre, descripcion, precio, categoriaid, imagenes, disponible, fechacreacion);
            const url = "https://img6.png";
            const imagen = imagen_1.Imagen.crear(imagen_id_1.ImagenId.generar(), url, "alt6", 6);
            expect(() => {
                producto.agregarImagen(imagen);
            }).toThrow(domain_exception_1.DomainException);
        });
        it('debería lanzar domainexception si la URL de la imagen no es válida', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("prueba");
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const precio = money_1.Money.crear(50, "mxn");
            const categoriaid = categoria_id_1.CategoriaId.generar();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const fechacreacion = datetime_1.DateTime.now();
            const producto = producto_1.Producto.crear(id, nombre, descripcion, precio, categoriaid, imagenes, disponible, fechacreacion);
            const urlInvalida = "img1.png";
            const imagenInvalida = imagen_1.Imagen.crear(imagen_id_1.ImagenId.generar(), urlInvalida, "alt1", 1);
            expect(() => {
                producto.agregarImagen(imagenInvalida);
            }).toThrow(domain_exception_1.DomainException);
        });
    });
    describe('activar', () => {
        it('debería lanzar DomainException si intenta activar un producto sin al menos una imagen', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("prueba");
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const precio = money_1.Money.crear(10, "MXN");
            const categoriaid = categoria_id_1.CategoriaId.generar();
            const fechacreacion = datetime_1.DateTime.now();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const productoInvalido = producto_1.Producto.crear(id, nombre, descripcion, precio, categoriaid, imagenes, disponible, fechacreacion);
            expect(() => {
                productoInvalido.activar();
            }).toThrow(domain_exception_1.DomainException);
        });
        it('debería lanzar DomainException si intenta activar un producto con precio menor o igual a cero', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("prueba");
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const categoriaid = categoria_id_1.CategoriaId.generar();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(true);
            const fechacreacion = datetime_1.DateTime.now();
            const precioInvalido = money_1.Money.crear(0, "MXN");
            // Forzamos la creación saltándonos el método estático
            const productoInvalido = new producto_1.Producto(id, nombre, descripcion, precioInvalido, categoriaid, imagenes, disponible, fechacreacion);
            expect(() => {
                productoInvalido.activar();
            }).toThrow(domain_exception_1.DomainException);
        });
    });
    describe('desactivar', () => {
        it('debería lanzar DomainException si intenta desactivar un producto desactivado previamente', () => {
            const id = producto_id_1.ProductoId.generar();
            const nombre = new nombre_1.Nombre("prueba");
            const descripcion = new descripcion_1.Descripcion("descripcion");
            const precio = money_1.Money.crear(10, "MXN");
            const categoriaid = categoria_id_1.CategoriaId.generar();
            const fechacreacion = datetime_1.DateTime.now();
            const imagenes = [];
            const disponible = new disponible_1.Disponible(false);
            const productoDesactivado = producto_1.Producto.crear(id, nombre, descripcion, precio, categoriaid, imagenes, disponible, fechacreacion);
            expect(() => {
                productoDesactivado.desactivar();
            }).toThrow(domain_exception_1.DomainException);
        });
    });
});
//# sourceMappingURL=producto.spec.js.map