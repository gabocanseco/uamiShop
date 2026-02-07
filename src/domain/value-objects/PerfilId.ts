import { v4 as uuid } from "uuid";

export class PerfilId {
    constructor(public readonly value: string) {
        if (!value) throw new Error("PerfilId requerido");
        if (!this.isValidUUID(value)) {
            throw new Error("PerfilId inválido");
        }
    }

    static create(): PerfilId {
        return new PerfilId(uuid());
    }

    static from(value: string): PerfilId {
        return new PerfilId(value);
    }

    private isValidUUID(value: string): boolean {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }

    equals(other: PerfilId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
