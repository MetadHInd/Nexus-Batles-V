export declare class SendEmailDto {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: any[];
}
export declare class SendBulkEmailDto {
    messages: SendEmailDto[];
}
export declare class SendTemplateEmailDto {
    to: string | string[];
    subject: string;
    templateName: string;
    templateData: Record<string, any>;
    attachments?: any[];
}
