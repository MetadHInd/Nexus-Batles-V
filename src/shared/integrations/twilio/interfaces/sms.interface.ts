/**
 * Interface base para servicios de SMS
 */
export interface ISmsService {
  sendSms(message: SmsMessage): Promise<SmsResult>;
  sendBulkSms(messages: SmsMessage[]): Promise<SmsResult[]>;
}

/**
 * Mensaje SMS
 */
export interface SmsMessage {
  to: string | string[];
  body: string;
  from?: string;
  mediaUrl?: string[];
}

/**
 * Resultado de envío de SMS
 */
export interface SmsResult {
  success: boolean;
  messageSid?: string;
  to?: string;
  status?: string;
  error?: string;
}
