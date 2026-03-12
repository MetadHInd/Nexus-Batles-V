export declare class PushButtonDto {
    id: string;
    text: string;
    url?: string;
}
export declare class PushRecipientDto {
    type: 'player_id' | 'segment' | 'all' | 'topic';
    value?: string | string[];
}
export declare class PushContentDto {
    title: string;
    body: string;
    imageUrl?: string;
    url?: string;
    data?: Record<string, any>;
    buttons?: PushButtonDto[];
}
export declare class SendPushDto {
    recipient: PushRecipientDto;
    content: PushContentDto;
    scheduleFor?: string;
    ttl?: number;
    priority?: 'high' | 'normal';
    silent?: boolean;
    collapseId?: string;
    channelId?: string;
}
export declare class SendBulkPushDto {
    messages: SendPushDto[];
}
