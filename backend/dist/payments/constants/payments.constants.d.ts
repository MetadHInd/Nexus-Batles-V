/**
 * payments.constants.ts
 * Constantes centrales del módulo de pagos de Nexus Battles.
 * Migrado y adaptado desde Imperial Guard → Nexus Battles (TypeScript).
 */
export declare const ORDER_STATUS: Readonly<{
    readonly PENDING: "PENDING";
    readonly PROCESSING: "PROCESSING";
    readonly PAID: "PAID";
    readonly FAILED: "FAILED";
    readonly REFUNDED: "REFUNDED";
    readonly CANCELLED: "CANCELLED";
}>;
export declare const TRANSACTION_STATUS: Readonly<{
    readonly INITIATED: "INITIATED";
    readonly PENDING: "PENDING";
    readonly APPROVED: "APPROVED";
    readonly REJECTED: "REJECTED";
    readonly REFUNDED: "REFUNDED";
    readonly ERROR: "ERROR";
}>;
export declare const GATEWAY_NAMES: Readonly<{
    readonly MERCADOPAGO: "mercadopago";
    readonly STRIPE: "stripe";
    readonly MOCK: "mock";
}>;
export declare const AUDIT_ACTIONS: Readonly<{
    readonly ORDER_CREATED: "ORDER_CREATED";
    readonly ORDER_STATUS_CHANGED: "ORDER_STATUS_CHANGED";
    readonly TRANSACTION_CREATED: "TRANSACTION_CREATED";
    readonly TX_STATUS_CHANGED: "TX_STATUS_CHANGED";
    readonly WEBHOOK_RECEIVED: "WEBHOOK_RECEIVED";
    readonly REFUND_REQUESTED: "REFUND_REQUESTED";
    readonly REFUND_COMPLETED: "REFUND_COMPLETED";
    readonly INVENTORY_ASSIGNED: "INVENTORY_ASSIGNED";
    readonly FRAUD_FLAG: "FRAUD_FLAG";
}>;
export declare const PAYMENT_LIMITS: Readonly<{
    readonly MAX_AMOUNT_CENTS: 10000000;
    readonly MIN_AMOUNT_CENTS: 100;
    readonly MAX_DAILY_ORDERS: 10;
    readonly RATE_LIMIT_WINDOW_MS: number;
    readonly RATE_LIMIT_MAX_REQ: 20;
}>;
export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];
export type GatewayName = typeof GATEWAY_NAMES[keyof typeof GATEWAY_NAMES];
export type AuditAction = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];
//# sourceMappingURL=payments.constants.d.ts.map