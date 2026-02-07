import { CrearUsuarioUseCase } from "../../application/use-cases/CrearUsuarioUseCase";
import { CrearPerfilUseCase } from "../../application/use-cases/CrearPerfilUseCase";
import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";
import { PerfilRepository } from "../../domain/repositories/PerfilRepository";
import { EventPublisher } from "../../domain/events/EventPublisher";
export declare class DIContainer {
    private static instance;
    private usuarioRepository;
    private perfilRepository;
    private eventPublisher;
    private constructor();
    static getInstance(): DIContainer;
    getCrearUsuarioUseCase(): CrearUsuarioUseCase;
    getCrearPerfilUseCase(): CrearPerfilUseCase;
    getUsuarioRepository(): UsuarioRepository;
    getPerfilRepository(): PerfilRepository;
    getEventPublisher(): EventPublisher;
}
//# sourceMappingURL=DIContainer.d.ts.map