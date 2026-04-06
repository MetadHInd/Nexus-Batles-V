# Historia de Usuario — Manejo de errores de pasarela de pago

| Campo         | Detalle |
|---------------|---------|
| **ID**        | HU-PAGOS-002 |
| **Rol**       | Sistema |
| **Módulo**    | Pagos / Pasarela |
| **Estado**    | Implementada |

---

## Descripción

> Como **sistema**, quiero gestionar errores y timeouts de la pasarela de pago para que
> los tokens del usuario **no se vean afectados** ante fallos de pago.

---

## Modelo de Datos

| Campo                | Tipo / Valores                        | Descripción |
|----------------------|---------------------------------------|-------------|
| `tipo_error`         | `TIMEOUT \| RECHAZO \| ERROR_RED`     | Clasificación del fallo de pasarela |
| `tokens_acreditados` | `0` (siempre ante error)              | Invariante: nunca se acreditan tokens si el pago no fue confirmado |
| `mensaje_usuario`    | `string`                              | Instrucciones legibles para reintentar o contactar soporte |

---

## Precondiciones

- Se ha iniciado una transacción de compra de tokens (orden en estado `PROCESSING`).

## Postcondiciones

- Ante cualquier error, **el saldo del usuario no se modifica** (`tokens_acreditados = 0`).
- Se registra el intento fallido con estado `FALLIDA` en `payment_transactions`.
- Se registra acción `TX_FALLIDA` en el log de auditoría con `tipo_error` y `mensaje_usuario`.

---

## Criterios de Aceptación

| # | Criterio | Implementación |
|---|----------|----------------|
| CA-1 | Ante timeout de la pasarela (>30s), el sistema muestra mensaje de error al usuario. | `MercadoPagoGateway._request` — timeout de 30 000 ms; evento `timeout` emite `ETIMEDOUT`. `PaymentErrorClassifier` → tipo `TIMEOUT`. |
| CA-2 | En ningún caso se acreditan tokens si el pago no fue confirmado por la pasarela. | `PaymentGatewayError.tokensAcreditados = 0` (campo `readonly`). La orden queda en `FAILED` sin ejecutar acreditación. |
| CA-3 | El sistema diferencia entre error de red, rechazo del banco y datos inválidos. | `PaymentErrorClassifier.classify()` → `TIMEOUT \| RECHAZO \| ERROR_RED`. |
| CA-4 | Se registra el intento de transacción con tipo `FALLIDA` en el historial. | `ProcessPaymentUseCase._handleGatewayError` actualiza `TRANSACTION_STATUS.FALLIDA` y crea audit log `TX_FALLIDA`. |
| CA-5 | El usuario recibe instrucciones claras para reintentar o contactar soporte. | `GATEWAY_ERROR_MESSAGES` en `payments.constants.ts` define el `mensaje_usuario` para cada tipo. |

---

## Archivos Implementados

```
backend/src/
├── payments/
│   ├── constants/
│   │   └── payments.constants.ts          ← GATEWAY_ERROR_TYPES, GATEWAY_ERROR_MESSAGES,
│   │                                         TRANSACTION_STATUS.FALLIDA, AUDIT_ACTIONS.TX_FALLIDA
│   └── domain/
│       ├── errors/
│       │   └── PaymentGatewayError.ts     ← Error tipificado (tipo, mensajeUsuario, tokensAcreditados=0)
│       └── services/
│           └── PaymentErrorClassifier.ts  ← Clasifica rawError → TIMEOUT | RECHAZO | ERROR_RED
├── infrastructure/
│   └── gateways/
│       └── MercadoPagoGateway.ts          ← Timeout 30s en _request (GATEWAY_TIMEOUT_MS)
└── application/
    └── usecases/payments/
        └── ProcessPaymentUseCase.ts       ← _handleGatewayError usa clasificador; registra FALLIDA
```

---

## Flujo de Error (Diagrama)

```
ProcessPaymentUseCase.execute()
    │
    ├─ gateway.createPayment() ──→ [timeout / error de red / rechazo]
    │       │
    │       ▼  catch(gatewayErr)
    │
    ├─ PaymentErrorClassifier.classify(gatewayErr)
    │       │
    │       ├─ ETIMEDOUT / timeout en mensaje  →  tipo: TIMEOUT
    │       ├─ HTTP 400/422 / status rejected  →  tipo: RECHAZO
    │       └─ cualquier otro error de red     →  tipo: ERROR_RED
    │
    └─ _handleGatewayError(transactionId, orderId, userId, typedError)
            │
            ├─ updateTransactionStatus(FALLIDA)   ← tokens_acreditados = 0
            ├─ updateOrderStatus(FAILED)
            ├─ createAuditLog(TX_FALLIDA, tipo_error, mensaje_usuario)
            └─ throw _error('GATEWAY_ERROR', typedError.mensajeUsuario, 502)
                        │
                        └─ HTTP 502 → { error: "<mensaje_usuario>", code: "GATEWAY_ERROR" }
```

---

## Mensajes de Usuario por Tipo de Error

| `tipo_error` | `mensaje_usuario` |
|---|---|
| `TIMEOUT` | "La pasarela de pago no respondió a tiempo (>30s). Por favor reintente en unos minutos o contacte a soporte." |
| `RECHAZO` | "El pago fue rechazado. Verifique sus datos bancarios o intente con otro método de pago. Si el problema persiste, contacte a soporte." |
| `ERROR_RED` | "Error de conexión con la pasarela de pago. Verifique su conexión a internet e intente nuevamente. Si el problema continúa, contacte a soporte." |
