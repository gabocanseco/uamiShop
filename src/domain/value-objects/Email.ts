export class Email {
    constructor(public readonly value: string) {
        if (!value) throw new Error("Email requerido");
        if (!this.isValidEmail(value)) {
            throw new Error("Email inválido");
        }
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    equals(other: Email): boolean {
        return this.value.toLowerCase() === other.value.toLowerCase();
    }

    toString(): string {
        return this.value;
    }
}
