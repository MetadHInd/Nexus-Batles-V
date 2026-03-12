import type { IPaymentRepository, DBConn, CreateOrderInput, CreateTransactionInput, CreateAuditLogInput, ProductReservationResult, TaxRuleResult, PromotionResult } from '../../domain/repositories/IPaymentRepository';
import type { PaymentOrder, PaymentTransaction } from '../../payments/domain/entities/PaymentEntities';
import type { OrderStatus, TransactionStatus } from '../../payments/constants/payments.constants';
export declare class MySQLPaymentRepository implements IPaymentRepository {
    beginTransaction(): Promise<DBConn>;
    commit(conn: DBConn): Promise<void>;
    rollback(conn: DBConn): Promise<void>;
    private db;
    createOrder(data: CreateOrderInput, conn: DBConn): Promise<{
        orderId: string;
    }>;
    getOrderById(orderId: string, conn?: DBConn | null, withLock?: boolean): Promise<PaymentOrder | null>;
    lockOrder(orderId: string, conn: DBConn): Promise<PaymentOrder | null>;
    updateOrderStatus(orderId: string, status: OrderStatus, conn?: DBConn | null): Promise<void>;
    countUserOrdersToday(userId: number): Promise<number>;
    createTransaction(data: CreateTransactionInput, conn: DBConn): Promise<{
        transactionId: string;
    }>;
    updateTransactionStatus(transactionId: string, status: TransactionStatus, rawResponse: Record<string, unknown>, conn?: DBConn | null): Promise<void>;
    findTransactionByIdempotencyKey(idempotencyKey: string): Promise<{
        order_id: string;
    } | null>;
    findTransactionByGatewayOrderId(gatewayOrderId: string): Promise<PaymentTransaction | null>;
    getTransactionByOrderId(orderId: string, conn?: DBConn | null): Promise<PaymentTransaction | null>;
    reserveProductForUser(productId: string, userId: number, conn: DBConn): Promise<ProductReservationResult>;
    assignProductToUser(orderId: string, userId: number, productId: string, conn: DBConn): Promise<void>;
    releaseProductReservation(productId: string, _userId: number, conn: DBConn): Promise<void>;
    getTaxRule(productId: string, countryCode: string): Promise<TaxRuleResult | null>;
    getValidPromotion(promoCode: string, productId: string, userId: number): Promise<PromotionResult | null>;
    createRefund(data: {
        transactionId: string;
        orderId: string;
        amount: number;
        reason: string;
        gatewayRefundId: string;
        requestedBy: string | number;
    }, conn: DBConn): Promise<{
        refundId: string;
    }>;
    createAuditLog(data: CreateAuditLogInput, conn?: DBConn | null): Promise<void>;
    findById(id: string): Promise<{
        id: string;
        status: string;
    } | null>;
    findByExternalId(externalId: string): Promise<{
        id: string;
        status: string;
    } | null>;
    updateStatus(id: string, status: string): Promise<void>;
}
export declare const paymentRepository: MySQLPaymentRepository;
