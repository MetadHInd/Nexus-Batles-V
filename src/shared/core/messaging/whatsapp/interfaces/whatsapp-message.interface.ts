export interface WhatsAppMessage {
  to: string;
  body: string;
  from?: string;
  type?: 'text' | 'image' | 'document' | 'audio' | 'video';
  mediaUrl?: string;
  metadata?: Record<string, any>;
}

export interface WhatsAppInteractiveListMessage {
  to: string;
  bodyText: string;
  buttonText: string;
  sections: Array<{
    title: string;
    rows: Array<{
      id: string;
      title: string;
      description?: string;
    }>;
  }>;
}

export interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
  details?: any;
}
