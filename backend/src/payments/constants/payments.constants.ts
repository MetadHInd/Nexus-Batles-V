/**
 * payments.constants.ts
 * Constantes centrales del módulo de pagos de Nexus Battles.
 * Migrado y adaptado desde Imperial Guard → Nexus Battles (TypeScript).
 */

export const ORDER_STATUS = Object.freeze({
  PENDING:    'PENDING',
  PROCESSING: 'PROCESSING',
  PAID:       'PAID',
  FAILED:     'FAILED',
  REFUNDED:   'REFUNDED',
  CANCELLED:  'CANCELLED',
} as const);

export const TRANSACTION_STATUS = Object.freeze({
  INITIATED:  'INITIATED',
  PENDING:    'PENDING',
  APPROVED:   'APPROVED',
  REJECTED:   'REJECTED',
  REFUNDED:   'REFUNDED',
  ERROR:      'ERROR',
  FALLIDA:    'FALLIDA',   // HU: Manejo de errores de pasarela — intento fallido registrado
} as const);

export const GATEWAY_NAMES = Object.freeze({
  MERCADOPAGO: 'mercadopago',
  STRIPE:      'stripe',
  MOCK:        'mock',
} as const);

export const AUDIT_ACTIONS = Object.freeze({
  ORDER_CREATED:        'ORDER_CREATED',
  ORDER_STATUS_CHANGED: 'ORDER_STATUS_CHANGED',
  TRANSACTION_CREATED:  'TRANSACTION_CREATED',
  TX_STATUS_CHANGED:    'TX_STATUS_CHANGED',
  TX_FALLIDA:           'TX_FALLIDA',           // HU: Manejo de errores de pasarela — intento fallido
  WEBHOOK_RECEIVED:     'WEBHOOK_RECEIVED',
  REFUND_REQUESTED:     'REFUND_REQUESTED',
  REFUND_COMPLETED:     'REFUND_COMPLETED',
  INVENTORY_ASSIGNED:   'INVENTORY_ASSIGNED',
  FRAUD_FLAG:           'FRAUD_FLAG',
} as const);

// ─── Tipos de error de pasarela (HU: Manejo de errores de pasarela de pago) ────
// tipo_error: TIMEOUT | RECHAZO | ERROR_RED
export const GATEWAY_ERROR_TYPES = Object.freeze({
  TIMEOUT:   'TIMEOUT',    // La pasarela no respondió en >30 segundos
  RECHAZO:   'RECHAZO',    // El banco / pasarela rechazó el pago (datos inválidos o fondos)
  ERROR_RED: 'ERROR_RED',  // Error de red o conexión con la pasarela
} as const);

// Mensajes de usuario para cada tipo de error (mensaje_usuario en el modelo)
export const GATEWAY_ERROR_MESSAGES = Object.freeze({
  TIMEOUT:
    'La pasarela de pago no respondió a tiempo (>30s). ' +
    'Por favor reintente en unos minutos o contacte a soporte.',
  RECHAZO:
    'El pago fue rechazado. Verifique sus datos bancarios ' +
    'o intente con otro método de pago. Si el problema persiste, contacte a soporte.',
  ERROR_RED:
    'Error de conexión con la pasarela de pago. ' +
    'Verifique su conexión a internet e intente nuevamente. ' +
    'Si el problema continúa, contacte a soporte.',
} as const);

export const PAYMENT_LIMITS = Object.freeze({
  MAX_AMOUNT_CENTS:     10_000_000, // $100,000.00
  MIN_AMOUNT_CENTS:     100,         // $1.00
  MAX_DAILY_ORDERS:     10,
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000,
  RATE_LIMIT_MAX_REQ:   20,
} as const);

// ─── Tipos derivados ──────────────────────────────────────────────────────────

export type OrderStatus       = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];
export type TransactionStatus = typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];
export type GatewayName       = typeof GATEWAY_NAMES[keyof typeof GATEWAY_NAMES];
export type AuditAction       = typeof AUDIT_ACTIONS[keyof typeof AUDIT_ACTIONS];
export type GatewayErrorType  = typeof GATEWAY_ERROR_TYPES[keyof typeof GATEWAY_ERROR_TYPES];
