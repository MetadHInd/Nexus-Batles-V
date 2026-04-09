export declare const inventoryLimiter: ((req: any, res: any, next: any) => any) | import("express-rate-limit").RateLimitRequestHandler;
export declare const generalLimiter: import("express-rate-limit").RateLimitRequestHandler | ((req: any, res: any, next: any) => any);
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler | ((req: any, res: any, next: any) => any);
export declare const sensitiveOperationsLimiter: import("express-rate-limit").RateLimitRequestHandler | ((req: any, res: any, next: any) => any);
//# sourceMappingURL=rateLimiter.middleware.d.ts.map