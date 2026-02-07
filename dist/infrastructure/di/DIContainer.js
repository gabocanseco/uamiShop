"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DIContainer = void 0;
const CrearUsuarioUseCase_1 = require("../../application/use-cases/CrearUsuarioUseCase");
const CrearPerfilUseCase_1 = require("../../application/use-cases/CrearPerfilUseCase");
const EventPublisher_1 = require("../../domain/events/EventPublisher");
const UsuarioRepositoryImpl_1 = require("../repositories/UsuarioRepositoryImpl");
const PerfilRepositoryImpl_1 = require("../repositories/PerfilRepositoryImpl");
class DIContainer {
    constructor() {
        // Inicializar dependencias
        this.usuarioRepository = new UsuarioRepositoryImpl_1.UsuarioRepositoryImpl();
        this.perfilRepository = new PerfilRepositoryImpl_1.PerfilRepositoryImpl();
        this.eventPublisher = EventPublisher_1.EventPublisher.getInstance();
    }
    static getInstance() {
        if (!DIContainer.instance) {
            DIContainer.instance = new DIContainer();
        }
        return DIContainer.instance;
    }
    getCrearUsuarioUseCase() {
        return new CrearUsuarioUseCase_1.CrearUsuarioUseCase(this.usuarioRepository, this.eventPublisher);
    }
    getCrearPerfilUseCase() {
        return new CrearPerfilUseCase_1.CrearPerfilUseCase(this.perfilRepository, this.eventPublisher);
    }
    getUsuarioRepository() {
        return this.usuarioRepository;
    }
    getPerfilRepository() {
        return this.perfilRepository;
    }
    getEventPublisher() {
        return this.eventPublisher;
    }
}
exports.DIContainer = DIContainer;
//# sourceMappingURL=DIContainer.js.map