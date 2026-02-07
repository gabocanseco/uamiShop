import { Usuario } from "../../domain/entities/Usuario";
import { UserId } from "../../domain/value-objects/UserId";
import { Email } from "../../domain/value-objects/Email";
import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";
import { EventPublisher } from "../../domain/events/EventPublisher";
import { CrearUsuarioRequest, UsuarioResponse } from "../dtos/UsuarioDTO";

export class CrearUsuarioUseCase {
    constructor(
        private usuarioRepository: UsuarioRepository,
        private eventPublisher: EventPublisher
    ) {}

    async execute(request: CrearUsuarioRequest): Promise<UsuarioResponse> {
        // Validar que el email no exista
        const emailVO = new Email(request.email);
        const usuarioExistente = await this.usuarioRepository.findByEmail(emailVO);
        
        if (usuarioExistente) {
            throw new Error("El email ya está registrado");
        }

        // Crear el nuevo usuario
        const id = UserId.create();
        const usuario = new Usuario(id, emailVO, request.passwordHash);

        // Guardar en repositorio
        await this.usuarioRepository.save(usuario);

        // Publicar eventos de dominio
        const events = usuario.getDomainEvents();
        for (const event of events) {
            await this.eventPublisher.publish(event);
        }
        usuario.clearDomainEvents();

        // Retornar respuesta
        return {
            id: usuario.id.value,
            email: usuario.email.value
        };
    }
}
