import { EmailMessage } from '../interfaces/email-message.interface';
interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    totalValue: number;
}
interface OrderConfirmationContext {
    customerName: string;
    orderNumber: string;
    orderDate: string;
    orderTime: string;
    items: OrderItem[];
    subtotal: number;
    deliveryPrice: number;
    taxValue: number;
    total: number;
    deliveryAddress: string;
    cityName: string;
    stateName: string;
    countryName: string;
    branchName: string;
    branchAddress: string;
    branchPhone: string;
    orderStatus: string;
    estimatedDeliveryTime: string;
    appName: string;
    supportEmail: string;
    currentYear: string;
    restaurantName?: string;
}
export declare const getOrderConfirmationEmail: (to: string, context: OrderConfirmationContext) => EmailMessage;
export {};
