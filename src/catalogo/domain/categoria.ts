import {CategoriaId} from "@catalogo/domain/categoria-id";
import {Nombre} from "@catalogo/domain/nombre";
import {Descripcion} from "@catalogo/domain/descripcion";

export class Categoria {
    constructor(
        private readonly id: CategoriaId,
        private nombre: Nombre,
        private descripcion: Descripcion,
        private categoriaPadreId: CategoriaId
    ) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.categoriaPadreId = categoriaPadreId;
    }

    public actualizar(nombre: Nombre, descripcion: Descripcion) : void {
        this.nombre = nombre;
        this.descripcion = descripcion;
    }

    public asignarPadre(categoriaPadreId: CategoriaId) : void {
        this.categoriaPadreId = categoriaPadreId;
    }
}