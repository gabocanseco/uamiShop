"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrearUsuarioUseCase = void 0;
const Usuario_1 = require("../../domain/entities/Usuario");
const UserId_1 = require("../../domain/value-objects/UserId");
const Email_1 = require("../../domain/value-objects/Email");
class CrearUsuarioUseCase {
    constructor(usuarioRepository, eventPublisher) {
        this.usuarioRepository = usuarioRepository;
        this.eventPublisher = eventPublisher;
    }
    async execute(request) {
        // Validar que el email no exista
        const emailVO = new Email_1.Email(request.email);
        const usuarioExistente = await this.usuarioRepository.findByEmail(emailVO);
        if (usuarioExistente) {
            throw new Error("El email ya está registrado");
        }
        // Crear el nuevo usuario
        const id = UserId_1.UserId.create();
        const usuario = new Usuario_1.Usuario(id, emailVO, request.passwordHash);
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
exports.CrearUsuarioUseCase = CrearUsuarioUseCase;
//# sourceMappingURL=CrearUsuarioUseCase.js.map