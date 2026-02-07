import {Producto} from "@catalogo/domain/producto";
import {ProductoId} from "@catalogo/domain/producto-id";
import {Money} from "@shared/domain/money";
import {CategoriaId} from "@catalogo/domain/categoria-id";
import {Disponible} from "@catalogo/domain/disponible";
import {Nombre} from "@catalogo/domain/nombre";
import {Descripcion} from "@catalogo/domain/descripcion";
import {Imagen} from "@catalogo/domain/imagen";
import {DateTime} from "@shared/domain/datetime";
import {DomainException} from "@shared/exception/domain-exception";
import {ImagenId} from "@catalogo/domain/imagen-id";

describe('Producto Agreggate', () => {
    describe('Creación', () => {
        it('debería lanzar DomainException si el nombre es muy corto', () => {
            const id = ProductoId.generar();
            const descripcion = new Descripcion("descripcion");
            const precio = Money.crear(10, "MXN");
            const categoriaId = CategoriaId.generar();
            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const fechaCreacion = DateTime.now();

            const nombreInvalido = new Nombre("ab");

            expect(() => {
                Producto.crear(
                    id,
                    nombreInvalido,
                    descripcion,
                    precio,
                    categoriaId,
                    imagenes,
                    disponible,
                    fechaCreacion
                )
            }).toThrow(DomainException);
        });

        it('debería lanzar DomainException si el nombre es muy largo', () => {
            const id = ProductoId.generar();
            const descripcion = new Descripcion("descripcion");
            const precio = Money.crear(10, "MXN");
            const categoriaId = CategoriaId.generar();
            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const fechaCreacion = DateTime.now();

            const nombreInvalido = new Nombre("N".repeat(101));

            expect(() => {
                Producto.crear(
                    id,
                    nombreInvalido,
                    descripcion,
                    precio,
                    categoriaId,
                    imagenes,
                    disponible,
                    fechaCreacion
                )
            }).toThrow(DomainException);
        });

        it('debería lanzar DomainException si el precio es menor o igual a cero', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("nombre producto");
            const descripcion = new Descripcion("descripcion");
            const categoriaId = CategoriaId.generar();
            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const fechaCreacion = DateTime.now();

            const precioInvalido = Money.crear(-1, "MXN");

            expect(() => {
                Producto.crear(
                    id,
                    nombre,
                    descripcion,
                    precioInvalido,
                    categoriaId,
                    imagenes,
                    disponible,
                    fechaCreacion
                )
            }).toThrow(DomainException);
        });

        it('debería lanzar DomainException si la descripción excede los 500 caracteres', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("nombre producto");
            const precio = Money.crear(-1, "MXN");
            const categoriaId = CategoriaId.generar();
            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const fechaCreacion = DateTime.now();

            const descripcionInvalida = new Descripcion("D".repeat(501));

            expect(() => {
                Producto.crear(
                    id,
                    nombre,
                    descripcionInvalida,
                    precio,
                    categoriaId,
                    imagenes,
                    disponible,
                    fechaCreacion
                )
            }).toThrow(DomainException);
        });
    });

    describe('cambiar precio', () => {
        it('debería lanzar domainexception si el nuevo precio es negativo', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("prueba");
            const descripcion = new Descripcion("descripcion");
            const precio = Money.crear(10, "MXN");
            const categoriaid = CategoriaId.generar();
            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const fechacreacion = DateTime.now();
            const producto = Producto.crear(
                id,
                nombre,
                descripcion,
                precio,
                categoriaid,
                imagenes,
                disponible,
                fechacreacion
            )

            const precioInvalido = Money.crear(-1, "MXN");

            expect(() => {
                producto.cambiarPrecio(precioInvalido);
            }).toThrow(DomainException);
        });

        it('debería lanzar domainexception si el nuevo precio incrementa más del 50% en un solo cambio', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("prueba");
            const descripcion = new Descripcion("descripcion");
            const precio = Money.crear(50, "mxn");
            const categoriaid = CategoriaId.generar();
            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const fechacreacion = DateTime.now();
            const producto = Producto.crear(
                id,
                nombre,
                descripcion,
                precio,
                categoriaid,
                imagenes,
                disponible,
                fechacreacion
            )

            // Precio con incremento arriba del 50%
            const precioInvalido = Money.crear(80, "MXN");

            expect(() => {
                producto.cambiarPrecio(precioInvalido);
            }).toThrow(DomainException);
        });
    });

    describe('agregar imagen', () => {
        it('debería lanzar DomainException si intenta agregar más de 5 imagenes', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("prueba");
            const descripcion = new Descripcion("descripcion");
            const precio = Money.crear(10, "mxn");
            const categoriaid = CategoriaId.generar();
            const urls = ["https://img1.png", "https://img2.png", "https://img3.png", "https://img5.png", "https://img5.png"];
            const imagenes: Imagen[] = [];
            for (let i = 0; i < urls.length; i++) {
                imagenes.push(Imagen.crear(
                    ImagenId.generar(), urls[i], `alt${i+1}`, i+1
                ))
            }
            const disponible = new Disponible(true);
            const fechacreacion = DateTime.now();
            const producto = Producto.crear(
                id,
                nombre,
                descripcion,
                precio,
                categoriaid,
                imagenes,
                disponible,
                fechacreacion
            )

            const url = "https://img6.png";
            const imagen = Imagen.crear(
                ImagenId.generar(), url, "alt6", 6
            )

            expect(() => {
                producto.agregarImagen(imagen);
            }).toThrow(DomainException);
        });

        it('debería lanzar domainexception si la URL de la imagen no es válida', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("prueba");
            const descripcion = new Descripcion("descripcion");
            const precio = Money.crear(50, "mxn");
            const categoriaid = CategoriaId.generar();
            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const fechacreacion = DateTime.now();
            const producto = Producto.crear(
                id,
                nombre,
                descripcion,
                precio,
                categoriaid,
                imagenes,
                disponible,
                fechacreacion
            )

            const urlInvalida = "img1.png";
            const imagenInvalida = Imagen.crear(
                ImagenId.generar(), urlInvalida, "alt1", 1
            )

            expect(() => {
                producto.agregarImagen(imagenInvalida);
            }).toThrow(DomainException);
        });
    });

    describe('activar', () => {
        it('debería lanzar DomainException si intenta activar un producto sin al menos una imagen', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("prueba");
            const descripcion = new Descripcion("descripcion");
            const precio = Money.crear(10, "MXN");
            const categoriaid = CategoriaId.generar();
            const fechacreacion = DateTime.now();

            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const productoInvalido = Producto.crear(
                id,
                nombre,
                descripcion,
                precio,
                categoriaid,
                imagenes,
                disponible,
                fechacreacion
            )

            expect(() => {
                productoInvalido.activar();
            }).toThrow(DomainException);
        });

        it('debería lanzar DomainException si intenta activar un producto con precio menor o igual a cero', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("prueba");
            const descripcion = new Descripcion("descripcion");
            const categoriaid = CategoriaId.generar();
            const imagenes: Imagen[] = [];
            const disponible = new Disponible(true);
            const fechacreacion = DateTime.now();

            const precioInvalido = Money.crear(0, "MXN");
            // Forzamos la creación saltándonos el método estático
            const productoInvalido = new (Producto as any)(
                id,
                nombre,
                descripcion,
                precioInvalido,
                categoriaid,
                imagenes,
                disponible,
                fechacreacion
            );

            expect(() => {
                productoInvalido.activar();
            }).toThrow(DomainException);
        });
    });

    describe('desactivar', () => {
        it('debería lanzar DomainException si intenta desactivar un producto desactivado previamente', () => {
            const id = ProductoId.generar();
            const nombre = new Nombre("prueba");
            const descripcion = new Descripcion("descripcion");
            const precio = Money.crear(10, "MXN");
            const categoriaid = CategoriaId.generar();
            const fechacreacion = DateTime.now();
            const imagenes: Imagen[] = [];

            const disponible = new Disponible(false);
            const productoDesactivado = Producto.crear(
                id,
                nombre,
                descripcion,
                precio,
                categoriaid,
                imagenes,
                disponible,
                fechacreacion
            )

            expect(() => {
                productoDesactivado.desactivar();
            }).toThrow(DomainException);
        });
    });
});
