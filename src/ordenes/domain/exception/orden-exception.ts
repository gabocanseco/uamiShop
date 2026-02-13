import {DomainException} from "@shared/exception/domain-exception";

export class OrdenException extends DomainException {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
