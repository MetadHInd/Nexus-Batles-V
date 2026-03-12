export interface OrderPdfData {
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    orderNumber: string;
    orderDate: string;
    orderTime: string;
    guestNumber: number;
    comment?: string;
    dietaryRestrictions?: string[];
    groups: OrderGroupPdf[];
    subtotal: number;
    deliveryPrice: number;
    discount?: number;
    discountAppliedAfterTax?: boolean;
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
    orderStatus: string;
    estimatedDeliveryTime: string;
    appName: string;
    restaurantName?: string;
    restaurantImageUrl?: string;
    deliveryType?: string;
}
export interface OrderGroupPdf {
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
    items: OrderItemPdf[];
}
export interface OrderItemPdf {
    name: string;
    quantity: number;
    unitPrice: number;
    totalValue: number;
    description?: string;
    selections?: string[];
    customComment?: string;
}
export interface CustomerInvoicePdfData {
    companyName: string;
    companyAddress: string;
    companyPhone: string;
    companyEmail?: string;
    companyLogo?: string;
    invoiceNumber: string;
    invoiceDate: string;
    dueDate?: string;
    customerName: string;
    customerEmail: string;
    customerPhone?: string;
    billingAddress: string;
    cityName: string;
    stateName: string;
    zipCode?: string;
    countryName: string;
    orderNumber: string;
    orderDate: string;
    orderTime: string;
    itemGroups?: InvoiceItemGroup[];
    lineItems: InvoiceLineItem[];
    subtotal: number;
    deliveryFee?: number;
    discount?: number;
    discountAppliedAfterTax?: boolean;
    taxRate?: number;
    taxAmount: number;
    tipAmount?: number;
    total: number;
    paymentMethod: string;
    paymentStatus: string;
    transactionId?: string;
    notes?: string;
    deliveryType?: string;
}
export interface InvoiceItemGroup {
    groupName: string;
    groupPrice: number;
    quantity: number;
    variation?: {
        name: string;
        serves: number;
    };
    categories: InvoiceCategory[];
}
export interface InvoiceCategory {
    categoryName: string;
    items: InvoiceLineItem[];
}
export interface InvoiceLineItem {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
    customComment?: string;
}
export declare class PdfService {
    private readonly logger;
    private readonly debugMode;
    private readonly debugPath;
    private readonly gmailPdfsPath;
    constructor();
    private getPuppeteerArgs;
    convertUrlToPdfForGmail(url: string, orderId?: string): Promise<Buffer>;
    private waitForRealContentGmail;
    private getPageDimensions;
    private savePdfForDebugGmail;
    generateOrderPdf(orderData: OrderPdfData): Promise<Buffer>;
    generateCustomerInvoicePdf(invoiceData: CustomerInvoicePdfData): Promise<Buffer>;
    private generateOrderHtml;
    private generateGroupedItemsHtml;
    private generateLineItemsHtml;
    private generateInvoiceHtml;
    transformOrderDetailsV2ToInvoiceData(orderDetails: any, invoiceNumber: string, transactionId?: string, restaurantData?: any): CustomerInvoicePdfData;
}
