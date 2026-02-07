import { v4 as uuid } from "uuid";

export class UserId {
    constructor(public readonly value: string) {
        if (!value) throw new Error("UserId requerido");
        if (!this.isValidUUID(value)) {
            throw new Error("UserId inválido");
        }
    }

    static create(): UserId {
        return new UserId(uuid());
    }

    static from(value: string): UserId {
        return new UserId(value);
    }

    private isValidUUID(value: string): boolean {
        const uuidRegex =
            /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }

    equals(other: UserId): boolean {
        return this.value === other.value;
    }

    toString(): string {
        return this.value;
    }
}
