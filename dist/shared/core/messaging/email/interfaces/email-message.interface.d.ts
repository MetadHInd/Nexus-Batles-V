export interface EmailMessage {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
    attachments?: any[];
    from?: string;
}
