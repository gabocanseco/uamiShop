import { Perfil } from "../../domain/entities/Perfil";
import { PerfilId } from "../../domain/value-objects/PerfilId";
import { Telefono } from "../../domain/value-objects/Telefono";
import { Direccion } from "../../domain/value-objects/Direccion";
import { PerfilRepository } from "../../domain/repositories/PerfilRepository";
import { EventPublisher } from "../../domain/events/EventPublisher";
import { CrearPerfilRequest, PerfilResponse } from "../dtos/PerfilDTO";

export class CrearPerfilUseCase {
    constructor(
        private perfilRepository: PerfilRepository,
        private eventPublisher: EventPublisher
    ) {}

    async execute(request: CrearPerfilRequest): Promise<PerfilResponse> {
        // Crear value objects
        const id = PerfilId.create();
        const telefono = new Telefono(request.telefono);
        const direccion = new Direccion(
            request.calle,
            request.numero,
            request.colonia,
            request.ciudad,
            request.codigoPostal
        );

        // Crear el nuevo perfil
        const perfil = new Perfil(
            id,
            request.nombre,
            request.apellidoPat,
            request.apellidoMat,
            request.fechaNacimiento,
            telefono,
            direccion
        );

        // Guardar en repositorio
        await this.perfilRepository.save(perfil);

        // Publicar eventos de dominio
        const events = perfil.getDomainEvents();
        for (const event of events) {
            await this.eventPublisher.publish(event);
        }
        perfil.clearDomainEvents();

        // Retornar respuesta
        return {
            id: perfil.id.value,
            nombre: perfil.nombre,
            apellidoPat: perfil.apellidoPat,
            apellidoMat: perfil.apellidoMat,
            fechaNacimiento: perfil.fechaNacimiento,
            telefono: perfil.telefono.value,
            direccion: {
                calle: perfil.direccion.calle,
                numero: perfil.direccion.numero,
                colonia: perfil.direccion.colonia,
                ciudad: perfil.direccion.ciudad,
                codigoPostal: perfil.direccion.codigoPostal
            }
        };
    }
}
