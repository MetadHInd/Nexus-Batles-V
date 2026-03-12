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
    static calculateTax(base: Money, taxRule: TaxRule | null): Money;
    static calculateDiscount(base: Money, discountRule: DiscountRule | null): Money;
    static calculateTotal(base: Money, tax: Money, discount: Money): Money;
}
