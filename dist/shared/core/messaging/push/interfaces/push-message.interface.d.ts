export interface PushButton {
    id: string;
    text: string;
    url?: string;
}
export interface PushRecipient {
    type: 'player_id' | 'segment' | 'all' | 'topic';
    value?: string | string[];
}
export interface PushContent {
    title: string;
    body: string;
    imageUrl?: string;
    url?: string;
    data?: Record<string, any>;
    buttons?: PushButton[];
}
export interface PushMessage {
    recipient: PushRecipient;
    content: PushContent;
    scheduleFor?: Date;
    ttl?: number;
    priority?: 'high' | 'normal';
    silent?: boolean;
    collapseId?: string;
    channelId?: string;
}
