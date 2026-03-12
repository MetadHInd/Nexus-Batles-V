"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingRules = void 0;
const Money_1 = require("../value-objects/Money");
class PricingRules {
    static calculateTax(base, taxRule) {
        if (!taxRule || taxRule.rate <= 0)
            return Money_1.Money.zero(base.currency);
        return base.multiply(taxRule.rate);
    }
    static calculateDiscount(base, discountRule) {
        if (!discountRule)
            return Money_1.Money.zero(base.currency);
        if (discountRule.type === 'PERCENTAGE') {
            if (discountRule.value < 0 || discountRule.value > 100) {
                throw new Error('PricingRules: percentage must be between 0 and 100');
            }
            return base.multiply(discountRule.value / 100);
        }
        if (discountRule.type === 'FIXED') {
            const fixed = new Money_1.Money(discountRule.value, base.currency);
            return fixed.amountInCents > base.amountInCents ? base : fixed;
        }
        throw new Error(`PricingRules: unknown discount type: ${discountRule.type}`);
    }
    static calculateTotal(base, tax, discount) {
        return base.add(tax).subtract(discount);
    }
}
exports.PricingRules = PricingRules;
//# sourceMappingURL=PricingRules.js.map