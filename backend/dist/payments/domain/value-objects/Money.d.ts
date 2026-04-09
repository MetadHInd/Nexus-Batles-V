/**
 * Money.ts — Value Object
 * Representa dinero de forma segura usando centavos (enteros).
 * Elimina errores de punto flotante en operaciones financieras.
 * Migrado desde Imperial Guard → TypeScript para Nexus Battles.
 */
export declare class Money {
    readonly amountInCents: number;
    readonly currency: string;
    constructor(amountInCents: number, currency: string);
    add(other: Money): Money;
    subtract(other: Money): Money;
    multiply(factor: number): Money;
    equals(other: Money): boolean;
    /** Convierte a decimal para presentación o pasarela (e.g. 1500 → 15.00) */
    toDecimal(): number;
    toString(): string;
    private _assertSameCurrency;
    /** Factory: crea Money a partir de un valor decimal (e.g. 15.99) */
    static fromDecimal(decimal: number, currency: string): Money;
    /** Factory: crea Money cero */
    static zero(currency: string): Money;
}
//# sourceMappingURL=Money.d.ts.map