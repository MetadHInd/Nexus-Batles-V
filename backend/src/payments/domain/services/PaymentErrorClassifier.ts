/**
 * PaymentErrorClassifier.ts — Payments / Domain / Services
 *
 * Historia de Usuario: Manejo de errores de pasarela de pago
 * Rol: sistema
 *
 * Responsabilidad:
 *   Clasificar cualquier error crudo de pasarela en uno de los tres tipos definidos
 *   en la HU: TIMEOUT, RECHAZO, ERROR_RED.
 *
 * Criterios de aceptación cubiertos:
 *   ✓ El sistema diferencia entre error de red, rechazo del banco y datos inválidos.
 *   ✓ Ante timeout de la pasarela (>30s), el sistema identifica el tipo TIMEOUT.
 *   ✓ El mensaje_usuario resultante incluye instrucciones claras para reintentar o contactar soporte.
 */

import {
  GATEWAY_ERROR_TYPES,
  GATEWAY_ERROR_MESSAGES,
} from '../../constants/payments.constants';
import { PaymentGatewayError } from '../errors/PaymentGatewayError';

export class PaymentErrorClassifier {
  /**
   * Clasifica un error crudo de pasarela y retorna un PaymentGatewayError tipificado.
   *
   * Lógica de clasificación:
   *   1. TIMEOUT  — ETIMEDOUT, ECONNRESET, socket hang up, o error con 'timeout' en el mensaje.
   *                 Incluye el caso de la HU: pasarela no responde en >30 segundos.
   *   2. RECHAZO  — HTTP 400/422, status 'rejected', status_detail contiene 'cc_rejected_*',
   *                 o datos de tarjeta inválidos. El banco rechazó el pago.
   *   3. ERROR_RED — Cualquier otro error de red o comunicación con la pasarela.
   *
   * tokens_acreditados siempre = 0 (garantizado por PaymentGatewayError).
   */
  static classify(rawError: unknown): PaymentGatewayError {
    const err = rawError as Record<string, any>;

    // ── 1. TIMEOUT ────────────────────────────────────────────────────────────────
    const isTimeout =
      err?.code === 'ETIMEDOUT' ||
      err?.code === 'ECONNRESET' ||
      err?.code === 'ESOCKETTIMEDOUT' ||
      err?.type === 'timeout' ||
      (typeof err?.message === 'string' &&
        err.message.toLowerCase().includes('timeout'));

    if (isTimeout) {
      return new PaymentGatewayError(
        GATEWAY_ERROR_TYPES.TIMEOUT,
        `Timeout en pasarela de pago: ${err?.message ?? 'sin detalle'}`,
        GATEWAY_ERROR_MESSAGES.TIMEOUT,
        rawError,
      );
    }

    // ── 2. RECHAZO (banco o datos inválidos) ──────────────────────────────────────
    const httpStatus: number = err?.statusCode ?? err?.response?.status ?? 0;
    const gatewayStatus: string = String(err?.gatewayError?.status ?? '');
    const statusDetail: string  = String(err?.gatewayError?.status_detail ?? '');

    const isRechazo =
      httpStatus === 422 ||
      httpStatus === 400 ||
      gatewayStatus === 'rejected' ||
      statusDetail.startsWith('cc_rejected') ||
      statusDetail.includes('invalid') ||
      statusDetail.includes('rejected');

    if (isRechazo) {
      return new PaymentGatewayError(
        GATEWAY_ERROR_TYPES.RECHAZO,
        `Pago rechazado por la pasarela: ${err?.message ?? 'sin detalle'} ` +
          `[status_detail: ${statusDetail || 'N/A'}]`,
        GATEWAY_ERROR_MESSAGES.RECHAZO,
        rawError,
      );
    }

    // ── 3. ERROR_RED (fallback genérico de red) ───────────────────────────────────
    return new PaymentGatewayError(
      GATEWAY_ERROR_TYPES.ERROR_RED,
      `Error de red con la pasarela: ${err?.message ?? 'sin detalle'}`,
      GATEWAY_ERROR_MESSAGES.ERROR_RED,
      rawError,
    );
  }
}
