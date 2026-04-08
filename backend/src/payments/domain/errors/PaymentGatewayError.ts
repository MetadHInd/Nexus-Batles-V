/**
 * PaymentGatewayError.ts — Payments / Domain / Errors
 *
 * Historia de Usuario: Manejo de errores de pasarela de pago
 * Rol: sistema
 *
 * Modelo de datos (según HU):
 *   tipo_error:         TIMEOUT | RECHAZO | ERROR_RED
 *   tokens_acreditados: 0  ← invariante: NUNCA se acreditan tokens ante error de pasarela
 *   mensaje_usuario:    string con instrucciones claras para reintentar o contactar soporte
 *
 * Postcondición garantizada: el saldo del usuario NO se modifica cuando se lanza este error.
 */

import type { GatewayErrorType } from '../../constants/payments.constants';

export class PaymentGatewayError extends Error {
  /**
   * Tokens acreditados ante un error de pasarela.
   * SIEMPRE es 0 — nunca se acreditan tokens si el pago no fue confirmado por la pasarela.
   */
  readonly tokensAcreditados: number = 0;

  /**
   * @param tipo           Clasificación del error: TIMEOUT | RECHAZO | ERROR_RED
   * @param message        Mensaje técnico interno (para logs)
   * @param mensajeUsuario Mensaje legible para el usuario final con instrucciones de acción
   * @param rawError       Error original de la pasarela (para auditoría)
   */
  constructor(
    public readonly tipo: GatewayErrorType,
    message: string,
    public readonly mensajeUsuario: string,
    public readonly rawError?: unknown,
  ) {
    super(message);
    this.name = 'PaymentGatewayError';
  }
}
