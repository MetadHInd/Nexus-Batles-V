/**
 * ProcessPaymentUseCase.ts — Application / Use Cases / Payments
 * Inicia el proceso de pago con la pasarela elegida.
 * Patrón: commit antes de llamada externa + manejo de error de pasarela.
 * Migrado desde Imperial Guard (JS) → TypeScript para Nexus Battles.
 */

import {
  ORDER_STATUS,
  TRANSACTION_STATUS,
  AUDIT_ACTIONS,
} from '../../../payments/constants/payments.constants';
import type { IPaymentRepository }      from '../../../domain/repositories/IPaymentRepository';
import type { IPaymentGateway }         from '../../ports/IPaymentGateway';
import { logger }                       from '../../../infrastructure/logging/logger';
// HU: Manejo de errores de pasarela de pago
import { PaymentErrorClassifier }       from '../../../payments/domain/services/PaymentErrorClassifier';
import { PaymentGatewayError }          from '../../../payments/domain/errors/PaymentGatewayError';

export interface ProcessPaymentInput {
  orderId:   string;
  userId:    number;
  buyerInfo: { email: string; name: string };
}

export interface ProcessPaymentResult {
  orderId:        string;
  transactionId:  string;
  gatewayOrderId: string;
  redirectUrl?:   string;
  clientSecret?:  string;
  gateway:        string;
}

export class ProcessPaymentUseCase {
  constructor(
    private readonly repository: IPaymentRepository,
    private readonly gateway:    IPaymentGateway,
  ) {}

  async execute(input: ProcessPaymentInput): Promise<ProcessPaymentResult> {
    const { orderId, userId, buyerInfo } = input;
    const conn = await this.repository.beginTransaction();

    try {
      // ── 1. Lock orden (evita race conditions) ────────────────────────────────
      const order = await this.repository.lockOrder(orderId, conn);
      if (!order) throw this._error('ORDER_NOT_FOUND', 'Orden no encontrada', 404);
      if (order.user_id !== userId)
        throw this._error('FORBIDDEN', 'No autorizado', 403);
      if (order.status !== ORDER_STATUS.PENDING)
        throw this._error('ORDER_NOT_PENDING', `La orden está en estado ${order.status}`, 409);

      // ── 2. Transición a PROCESSING ────────────────────────────────────────────
      await this.repository.updateOrderStatus(orderId, ORDER_STATUS.PROCESSING, conn);
      await this.repository.createAuditLog({
        entityType: 'ORDER', entityId: orderId,
        action:         AUDIT_ACTIONS.ORDER_STATUS_CHANGED,
        previousStatus: ORDER_STATUS.PENDING,
        newStatus:      ORDER_STATUS.PROCESSING,
        actorId:        userId,
        metadata:       { gateway: this.gateway.getGatewayName() },
      }, conn);

      // ── 3. Crear transacción en estado INITIATED ───────────────────────────
      const { transactionId } = await this.repository.createTransaction({
        orderId,
        gatewayName:        this.gateway.getGatewayName(),
        gatewayOrderId:     null,
        status:             TRANSACTION_STATUS.INITIATED,
        amount:             order.total_amount,
        currency:           order.currency,
        gatewayRawResponse: {},
      }, conn);

      await this.repository.createAuditLog({
        entityType: 'TRANSACTION', entityId: transactionId,
        action:         AUDIT_ACTIONS.TRANSACTION_CREATED,
        previousStatus: null,
        newStatus:      TRANSACTION_STATUS.INITIATED,
        actorId:        userId,
        metadata:       { orderId, gateway: this.gateway.getGatewayName() },
      }, conn);

      // ── 4. Commit ANTES de llamar a la pasarela (no bloquear con TX abierta) ─
      await this.repository.commit(conn);

      // ── 5. Llamar pasarela (fuera de TX) ──────────────────────────────────────
      let gatewayResult;
      try {
        gatewayResult = await this.gateway.createPayment({
          orderId,
          totalAmount:    order.total_amount,
          currency:       order.currency,
          description:    `Nexus Battles — Orden ${orderId}`,
          idempotencyKey: order.idempotency_key,
          buyer:          buyerInfo,
          items: [{
            title:     `Producto #${order.product_id}`,
            quantity:  1,
            unitPrice: order.total_amount,
          }],
        });
      } catch (gatewayErr: any) {
        // HU: Manejo de errores — clasificar el error antes de registrarlo
        const typedError = PaymentErrorClassifier.classify(gatewayErr);
        await this._handleGatewayError(transactionId, orderId, userId, typedError);
        // Propagar el mensajeUsuario al cliente (tokens_acreditados = 0 garantizado)
        throw this._error('GATEWAY_ERROR', typedError.mensajeUsuario, 502);
      }

      // ── 6. Actualizar transacción con datos de pasarela ───────────────────────
      const conn2 = await this.repository.beginTransaction();
      try {
        await this.repository.updateTransactionStatus(
          transactionId, TRANSACTION_STATUS.PENDING, gatewayResult.rawResponse, conn2
        );
        // Guardar gateway_order_id necesario para procesar el webhook
        await (conn2 as any).execute(
          'UPDATE payment_transactions SET gateway_order_id = ? WHERE transaction_id = ?',
          [gatewayResult.gatewayOrderId, transactionId]
        );
        await this.repository.commit(conn2);
      } catch (e) {
        await this.repository.rollback(conn2);
        throw e;
      }

      logger.info('ProcessPayment: payment initiated', {
        orderId, transactionId,
        gateway:        this.gateway.getGatewayName(),
        gatewayOrderId: gatewayResult.gatewayOrderId,
      });

      return {
        orderId,
        transactionId,
        gatewayOrderId: gatewayResult.gatewayOrderId,
        redirectUrl:    gatewayResult.redirectUrl,
        clientSecret:   gatewayResult.clientSecret,
        gateway:        this.gateway.getGatewayName(),
      };

    } catch (err) {
      try { await this.repository.rollback(conn); } catch (_) {}
      throw err;
    }
  }

  /**
   * HU: Manejo de errores de pasarela de pago
   *
   * Postcondiciones garantizadas:
   *   - El saldo (tokens) del usuario NO se modifica.
   *   - Se registra el intento fallido con status FALLIDA en la transacción.
   *   - Se registra acción TX_FALLIDA en el log de auditoría con tipo_error y mensaje_usuario.
   */
  private async _handleGatewayError(
    transactionId: string,
    orderId:       string,
    userId:        number,
    typedError:    PaymentGatewayError,
  ): Promise<void> {
    const conn = await this.repository.beginTransaction();
    try {
      // Marcar transacción como FALLIDA (no ERROR genérico) con metadata de clasificación
      await this.repository.updateTransactionStatus(
        transactionId,
        TRANSACTION_STATUS.FALLIDA,
        {
          tipo_error:       typedError.tipo,
          mensaje_usuario:  typedError.mensajeUsuario,
          tokens_acreditados: typedError.tokensAcreditados, // siempre 0
          error:            typedError.message,
        },
        conn,
      );

      // Orden pasa a FAILED — los tokens del usuario no se acreditan
      await this.repository.updateOrderStatus(orderId, ORDER_STATUS.FAILED, conn);

      // Auditoría: registrar intento fallido con tipo de error diferenciado
      await this.repository.createAuditLog({
        entityType:     'TRANSACTION',
        entityId:       transactionId,
        action:         AUDIT_ACTIONS.TX_FALLIDA,
        previousStatus: TRANSACTION_STATUS.INITIATED,
        newStatus:      TRANSACTION_STATUS.FALLIDA,
        actorId:        userId,
        metadata: {
          tipo_error:         typedError.tipo,
          mensaje_usuario:    typedError.mensajeUsuario,
          tokens_acreditados: typedError.tokensAcreditados,
          orderId,
        },
      }, conn);

      await this.repository.commit(conn);

      logger.warn('ProcessPayment: gateway error — intento fallido registrado', {
        transactionId,
        orderId,
        tipo_error:      typedError.tipo,
        mensaje_usuario: typedError.mensajeUsuario,
      });
    } catch (e) {
      await this.repository.rollback(conn);
      logger.error('ProcessPayment: failed to record gateway error', {
        error: (e as Error).message,
      });
    }
  }

  private _error(code: string, message: string, statusCode: number): Error {
    const err: any = new Error(message);
    err.code       = code;
    err.statusCode = statusCode;
    return err;
  }
}
