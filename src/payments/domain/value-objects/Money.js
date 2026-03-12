"use strict";
/**
 * Money.ts — Value Object
 * Representa dinero de forma segura usando centavos (enteros).
 * Elimina errores de punto flotante en operaciones financieras.
 * Migrado desde Imperial Guard → TypeScript para Nexus Battles.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
var Money = /** @class */ (function () {
    function Money(amountInCents, currency) {
        if (!Number.isInteger(amountInCents) || amountInCents < 0) {
            throw new Error("Money: amount must be a non-negative integer (cents). Got: ".concat(amountInCents));
        }
        if (!currency || typeof currency !== 'string') {
            throw new Error('Money: currency is required');
        }
        this.amountInCents = amountInCents;
        this.currency = currency.toUpperCase();
    }
    Money.prototype.add = function (other) {
        this._assertSameCurrency(other);
        return new Money(this.amountInCents + other.amountInCents, this.currency);
    };
    Money.prototype.subtract = function (other) {
        this._assertSameCurrency(other);
        var result = this.amountInCents - other.amountInCents;
        if (result < 0)
            throw new Error('Money: subtraction result cannot be negative');
        return new Money(result, this.currency);
    };
    Money.prototype.multiply = function (factor) {
        return new Money(Math.round(this.amountInCents * factor), this.currency);
    };
    Money.prototype.equals = function (other) {
        return this.amountInCents === other.amountInCents && this.currency === other.currency;
    };
    /** Convierte a decimal para presentación o pasarela (e.g. 1500 → 15.00) */
    Money.prototype.toDecimal = function () {
        return this.amountInCents / 100;
    };
    Money.prototype.toString = function () {
        return "".concat(this.currency, " ").concat(this.toDecimal().toFixed(2));
    };
    Money.prototype._assertSameCurrency = function (other) {
        if (this.currency !== other.currency) {
            throw new Error("Money: currency mismatch ".concat(this.currency, " vs ").concat(other.currency));
        }
    };
    /** Factory: crea Money a partir de un valor decimal (e.g. 15.99) */
    Money.fromDecimal = function (decimal, currency) {
        return new Money(Math.round(decimal * 100), currency);
    };
    /** Factory: crea Money cero */
    Money.zero = function (currency) {
        return new Money(0, currency);
    };
    return Money;
}());
exports.Money = Money;
