"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(value) {
        this.value = value;
        if (!value)
            throw new Error("Email requerido");
        if (!this.isValidEmail(value)) {
            throw new Error("Email inválido");
        }
    }
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    equals(other) {
        return this.value.toLowerCase() === other.value.toLowerCase();
    }
    toString() {
        return this.value;
    }
}
exports.Email = Email;
//# sourceMappingURL=Email.js.map