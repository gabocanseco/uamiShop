export declare class UserId {
    readonly value: string;
    constructor(value: string);
    static create(): UserId;
    static from(value: string): UserId;
    private isValidUUID;
    equals(other: UserId): boolean;
    toString(): string;
}
//# sourceMappingURL=UserId.d.ts.map