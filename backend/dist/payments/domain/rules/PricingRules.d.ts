/**
 * PricingRules.ts — Domain Service
 * Lógica de cálculo de precios: impuestos, descuentos y totales.
 * Migrado desde Imperial Guard → TypeScript para Nexus Battles.
 * Toda la lógica opera sobre el Value Object Money (centavos).
 */
import { Money } from '../value-objects/Money';
export interface TaxRule {
    rate: number;
    countryCode: string;
}
export interface DiscountRule {
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
}
export declare class PricingRules {
    /**
     * Calcula el impuesto sobre el precio base.
     * @param base    Precio base en Money
     * @param taxRule Regla fiscal del país
     */
    static calculateTax(base: Money, taxRule: TaxRule | null): Money;
    /**
     * Calcula el descuento aplicable.
     * @param base          Precio base
     * @param discountRule  Tipo y valor del descuento
     */
    static calculateDiscount(base: Money, discountRule: DiscountRule | null): Money;
    /**
     * Calcula el total final: base + tax − discount
     */
    static calculateTotal(base: Money, tax: Money, discount: Money): Money;
}
//# sourceMappingURL=PricingRules.d.ts.map