import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";
import { EventPublisher } from "../../domain/events/EventPublisher";
import { CrearUsuarioRequest, UsuarioResponse } from "../dtos/UsuarioDTO";
export declare class CrearUsuarioUseCase {
    private usuarioRepository;
    private eventPublisher;
    constructor(usuarioRepository: UsuarioRepository, eventPublisher: EventPublisher);
    execute(request: CrearUsuarioRequest): Promise<UsuarioResponse>;
}
//# sourceMappingURL=CrearUsuarioUseCase.d.ts.map