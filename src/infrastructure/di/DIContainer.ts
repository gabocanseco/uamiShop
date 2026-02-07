import { CrearUsuarioUseCase } from "../../application/use-cases/CrearUsuarioUseCase";
import { CrearPerfilUseCase } from "../../application/use-cases/CrearPerfilUseCase";
import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";
import { PerfilRepository } from "../../domain/repositories/PerfilRepository";
import { EventPublisher } from "../../domain/events/EventPublisher";
import { UsuarioRepositoryImpl } from "../repositories/UsuarioRepositoryImpl";
import { PerfilRepositoryImpl } from "../repositories/PerfilRepositoryImpl";

export class DIContainer {
    private static instance: DIContainer;
    private usuarioRepository: UsuarioRepository;
    private perfilRepository: PerfilRepository;
    private eventPublisher: EventPublisher;

    private constructor() {
        // Inicializar dependencias
        this.usuarioRepository = new UsuarioRepositoryImpl();
        this.perfilRepository = new PerfilRepositoryImpl();
        this.eventPublisher = EventPublisher.getInstance();
    }

    static getInstance(): DIContainer {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }

    getCrearUsuarioUseCase(): CrearUsuarioUseCase {
        return new CrearUsuarioUseCase(this.usuarioRepository, this.eventPublisher);
    }

    getCrearPerfilUseCase(): CrearPerfilUseCase {
        return new CrearPerfilUseCase(this.perfilRepository, this.eventPublisher);
    }

    getUsuarioRepository(): UsuarioRepository {
        return this.usuarioRepository;
    }

    getPerfilRepository(): PerfilRepository {
        return this.perfilRepository;
    }

    getEventPublisher(): EventPublisher {
        return this.eventPublisher;
    }
}
