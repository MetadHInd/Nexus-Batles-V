/**
 * usePayment.ts — Custom hook
 * State machine for the full checkout flow:
 * IDLE → CREATING_ORDER → PROCESSING → REDIRECTING | SUCCESS | ERROR
 */

import { useState, useCallback } from 'react';
import { randomUUID } from '../utils/uuid';
import { paymentsApi } from '../api/payments';
import type {
  ShopProduct,
  CreateOrderResult,
  ProcessPaymentResult,
  BuyerInfo,
} from '../api/payments';

export type PaymentStep =
  | 'IDLE'
  | 'CREATING_ORDER'
  | 'PROCESSING_PAYMENT'
  | 'REDIRECTING'
  | 'SUCCESS'
  | 'ERROR';

export interface PaymentState {
  step:        PaymentStep;
  product:     ShopProduct | null;
  order:       CreateOrderResult | null;
  result:      ProcessPaymentResult | null;
  error:       string | null;
}

const initial: PaymentState = {
  step:    'IDLE',
  product: null,
  order:   null,
  result:  null,
  error:   null,
};

export function usePayment() {
  const [state, setState] = useState<PaymentState>(initial);

  const selectProduct = useCallback((product: ShopProduct) => {
    setState({ ...initial, step: 'IDLE', product });
  }, []);

  const startCheckout = useCallback(async (
    product:     ShopProduct,
    buyerInfo:   BuyerInfo,
    countryCode: string,
    promoCode?:  string,
    gateway      = 'mock'
  ) => {
    setState(s => ({ ...s, step: 'CREATING_ORDER', error: null }));

    try {
      // 1. Create order
      const idempotencyKey = randomUUID();
      const { data: orderRes } = await paymentsApi.createOrder({
        productId:      product.product_id,
        currency:       product.currency,
        countryCode,
        idempotencyKey,
        buyerInfo,
        promoCode,
      });

      const order = orderRes.data;
      setState(s => ({ ...s, step: 'PROCESSING_PAYMENT', order }));

      // 2. Process payment
      const { data: payRes } = await paymentsApi.processPayment(order.orderId, {
        gateway,
        buyerInfo,
      });

      const result = payRes.data;

      // 3. If there is a redirect (MercadoPago), go there
      if (result.redirectUrl) {
        setState(s => ({ ...s, step: 'REDIRECTING', result }));
        setTimeout(() => {
          window.location.href = result.redirectUrl!;
        }, 1500);
        return;
      }

      setState(s => ({ ...s, step: 'SUCCESS', result }));
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ??
        err?.response?.data?.message ??
        'Error al procesar el pago. Inténtalo de nuevo.';
      setState(s => ({ ...s, step: 'ERROR', error: msg }));
    }
  }, []);

  const reset = useCallback(() => setState(initial), []);

  return { state, selectProduct, startCheckout, reset };
}
