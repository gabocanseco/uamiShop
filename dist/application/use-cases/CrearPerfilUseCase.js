"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearPerfilUseCase = void 0;
const Perfil_1 = require("../../domain/entities/Perfil");
const PerfilId_1 = require("../../domain/value-objects/PerfilId");
const Telefono_1 = require("../../domain/value-objects/Telefono");
const Direccion_1 = require("../../domain/value-objects/Direccion");
class CrearPerfilUseCase {
    constructor(perfilRepository, eventPublisher) {
        this.perfilRepository = perfilRepository;
        this.eventPublisher = eventPublisher;
    }
    async execute(request) {
        // Crear value objects
        const id = PerfilId_1.PerfilId.create();
        const telefono = new Telefono_1.Telefono(request.telefono);
        const direccion = new Direccion_1.Direccion(request.calle, request.numero, request.colonia, request.ciudad, request.codigoPostal);
        // Crear el nuevo perfil
        const perfil = new Perfil_1.Perfil(id, request.nombre, request.apellidoPat, request.apellidoMat, request.fechaNacimiento, telefono, direccion);
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
exports.CrearPerfilUseCase = CrearPerfilUseCase;
//# sourceMappingURL=CrearPerfilUseCase.js.map