import { UsuarioId } from "./usuarioId";
export class Domicilio{
    readonly calle:string;
    readonly numero:string;
    readonly ciudad:string;
    readonly pais:string;
    readonly usuarioId:UsuarioId;
    readonly referentcia:string;

    constructor(calle:string, numero:string, ciudad:string, pais:string, usuarioId:UsuarioId, referentcia:string){
        this.calle = calle;
        this.numero = numero;
        this.ciudad = ciudad;
        this.pais = pais;
        this.usuarioId = usuarioId;
        this.referentcia = referentcia;
    }
}