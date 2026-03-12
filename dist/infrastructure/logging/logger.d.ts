import winston from 'winston';
export declare const logger: winston.Logger;
export declare const audit: {
    login: (userId: string, ip: string, success: boolean) => winston.Logger;
    auctionBid: (auctionId: string, bidderId: string, amount: number) => winston.Logger;
    paymentProcessed: (transactionId: string, playerId: string, amount: number) => winston.Logger;
    missionCompleted: (missionId: string, playerId: string, reward: number) => winston.Logger;
    rankChange: (playerId: string, oldRank: number, newRank: number) => winston.Logger;
    securityHmacFail: (ip: string, route: string) => winston.Logger;
    rateLimitHit: (ip: string, route: string) => winston.Logger;
};
