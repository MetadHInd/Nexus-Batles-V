export declare class NotificationFormatter {
    static validatePhoneNumber(phone: string): {
        type: 'SMS';
        value: string;
    } | null;
    static validatePlayerId(playerId: string): {
        type: 'PUSH';
        value: string;
    } | null;
    static validateTokenType(token: string): {
        type: 'SMS' | 'PUSH' | 'EMAIL';
        value: string;
    };
}
