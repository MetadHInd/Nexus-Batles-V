export declare class Money {
    readonly amountInCents: number;
    readonly currency: string;
    constructor(amountInCents: number, currency: string);
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(factor: number): Money;
    equals(other: Money): boolean;
    toDecimal(): number;
    toString(): string;
    private _assertSameCurrency;
    static fromDecimal(decimal: number, currency: string): Money;
    static zero(currency: string): Money;
}
