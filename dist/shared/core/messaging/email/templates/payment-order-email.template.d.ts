import { EmailMessage } from '../interfaces/email-message.interface';
interface OrderGroup {
    groupName: string;
    isGrouped: boolean;
    groupTotal: number;
    variationId?: number;
    quantity?: number;
    variation?: {
        id: number;
        name: string;
        price: number;
        serves: number;
    };
    items: OrderGroupItem[];
}
interface OrderGroupItem {
    name: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    description?: string;
    selections?: string[];
}
interface PaymentOrderEmailContext {
    customerName: string;
    customerEmail: string;
    orderNumber: string;
    orderDate: string;
    orderTime: string;
    guestNumber: number;
    groups: OrderGroup[];
    subtotal: number;
    deliveryPrice: number;
    taxValue: number;
    tipAmount?: number;
    total: number;
    deliveryAddress: string;
    cityName: string;
    stateName: string;
    countryName: string;
    branchName: string;
    branchAddress: string;
    branchPhone: string;
    branchCity?: string;
    branchState?: string;
    branchCountry?: string;
    orderStatus: string;
    estimatedDeliveryTime: string;
    appName: string;
    supportEmail: string;
    currentYear: string;
    currentPaymentUrl: string;
    includePaymentButton?: boolean;
    restaurantName?: string;
    discount?: number;
    calculateDiscountAfterTaxes?: boolean;
    isRefundEmail?: boolean;
    refundAmount?: number;
    originalTotal?: number;
    isExtraQuoteEmail?: boolean;
}
export declare const getPaymentOrderEmail: (to: string, context: PaymentOrderEmailContext) => EmailMessage;
export {};
