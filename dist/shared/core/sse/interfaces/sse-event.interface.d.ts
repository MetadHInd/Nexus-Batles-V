export interface SSEEvent<T = any> {
    id?: string;
    event: string;
    data: T;
    retry?: number;
    timestamp: string;
}
export interface SSEEventFormatter {
    format<T>(event: SSEEvent<T>): string;
}
export interface SSESendOptions {
    filter?: (client: any) => boolean;
    transform?: (data: any) => any;
    validate?: (data: any) => boolean;
    retry?: {
        attempts: number;
        delayMs: number;
    };
}
export interface SSESendResult {
    successCount: number;
    failureCount: number;
    failedClientIds: string[];
    timestamp: Date;
}
