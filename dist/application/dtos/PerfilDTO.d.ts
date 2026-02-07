export interface CrearPerfilRequest {
    nombre: string;
    apellidoPat: string;
    apellidoMat: string;
    fechaNacimiento: Date;
    telefono: string;
    calle: string;
    numero: number;
    colonia: string;
    ciudad: string;
    codigoPostal: string;
}
export interface PerfilResponse {
    id: string;
    nombre: string;
    apellidoPat: string;
    apellidoMat: string;
    fechaNacimiento: Date;
    telefono: string;
    direccion: {
        calle: string;
        numero: number;
        colonia: string;
        ciudad: string;
        codigoPostal: string;
    };
}
//# sourceMappingURL=PerfilDTO.d.ts.map