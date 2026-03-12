import { OrderStatus, TransactionStatus, GatewayName, AuditAction } from '../../constants/payments.constants';
export interface PaymentOrder {
    order_id: string;
    user_id: number;
    product_id: string;
    base_amount: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    currency: string;
    status: OrderStatus;
    idempotency_key: string;
    promotion_id: string | null;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
export interface PaymentTransaction {
    transaction_id: string;
    order_id: string;
    gateway_name: GatewayName;
    gateway_order_id: string | null;
    status: TransactionStatus;
    amount: number;
    currency: string;
    gateway_raw_response: Record<string, unknown>;
    created_at: Date;
    updated_at: Date;
}
export interface AuditLog {
    log_id: string;
    entity_type: 'ORDER' | 'TRANSACTION' | 'INVENTORY';
    entity_id: string;
    action: AuditAction;
    previous_status: string | null;
    new_status: string | null;
    actor_id: string | number;
    metadata: Record<string, unknown>;
    created_at: Date;
}
export interface BuyerInfo {
    email: string;
    name: string;
    phone?: string;
    docType?: string;
    docNumber?: string;
}
export interface GatewayPaymentResult {
    gatewayOrderId: string;
    redirectUrl?: string;
    clientSecret?: string;
    rawResponse: Record<string, unknown>;
}
export interface GatewayRefundResult {
    refundId: string;
    status: string;
    rawResponse: Record<string, unknown>;
}
export interface GatewayStatusResult {
    status: TransactionStatus;
    rawResponse: Record<string, unknown>;
}
