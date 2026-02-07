import { PerfilRepository } from "../../domain/repositories/PerfilRepository";
import { EventPublisher } from "../../domain/events/EventPublisher";
import { CrearPerfilRequest, PerfilResponse } from "../dtos/PerfilDTO";
export declare class CrearPerfilUseCase {
    private perfilRepository;
    private eventPublisher;
    constructor(perfilRepository: PerfilRepository, eventPublisher: EventPublisher);
    execute(request: CrearPerfilRequest): Promise<PerfilResponse>;
}
//# sourceMappingURL=CrearPerfilUseCase.d.ts.map