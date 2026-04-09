"use strict";
/**
 * Money.ts — Value Object
 * Representa dinero de forma segura usando centavos (enteros).
 * Elimina errores de punto flotante en operaciones financieras.
 * Migrado desde Imperial Guard → TypeScript para Nexus Battles.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
class Money {
    constructor(amountInCents, currency) {
        if (!Number.isInteger(amountInCents) || amountInCents < 0) {
            throw new Error(`Money: amount must be a non-negative integer (cents). Got: ${amountInCents}`);
        }
        if (!currency || typeof currency !== 'string') {
            throw new Error('Money: currency is required');
        }
        this.amountInCents = amountInCents;
        this.currency = currency.toUpperCase();
    }
    add(other) {
        this._assertSameCurrency(other);
        return new Money(this.amountInCents + other.amountInCents, this.currency);
    }
    subtract(other) {
        this._assertSameCurrency(other);
        const result = this.amountInCents - other.amountInCents;
        if (result < 0)
            throw new Error('Money: subtraction result cannot be negative');
        return new Money(result, this.currency);
    }
    multiply(factor) {
        return new Money(Math.round(this.amountInCents * factor), this.currency);
    }
    equals(other) {
        return this.amountInCents === other.amountInCents && this.currency === other.currency;
    }
    /** Convierte a decimal para presentación o pasarela (e.g. 1500 → 15.00) */
    toDecimal() {
        return this.amountInCents / 100;
    }
    toString() {
        return `${this.currency} ${this.toDecimal().toFixed(2)}`;
    }
    _assertSameCurrency(other) {
        if (this.currency !== other.currency) {
            throw new Error(`Money: currency mismatch ${this.currency} vs ${other.currency}`);
        }
    }
    /** Factory: crea Money a partir de un valor decimal (e.g. 15.99) */
    static fromDecimal(decimal, currency) {
        return new Money(Math.round(decimal * 100), currency);
    }
    /** Factory: crea Money cero */
    static zero(currency) {
        return new Money(0, currency);
    }
}
exports.Money = Money;
//# sourceMappingURL=Money.js.map