import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class SSERateLimitGuard implements CanActivate {
    private readonly logger;
    private readonly connectionAttempts;
    private readonly activeConnections;
    private readonly config;
    canActivate(context: ExecutionContext): boolean;
    private getClientIp;
    decrementConnection(ip: string): void;
    private getTotalActiveConnections;
    updateConfig(config: Partial<typeof this.config>): void;
    getStats(): {
        activeConnections: {
            [k: string]: number;
        };
        totalActiveConnections: number;
        ipsWithAttempts: number;
        config: {
            maxAttemptsPerWindow: number;
            windowMs: number;
            maxConcurrentPerIp: number;
            maxGlobalConnections: number;
            enableWhitelist: boolean;
            whitelist: string[];
        };
    };
    resetIp(ip: string): void;
    cleanup(): void;
}
