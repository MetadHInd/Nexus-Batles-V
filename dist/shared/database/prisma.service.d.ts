import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger;
    private client;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
    healthCheck(): Promise<{
        status: string;
        latency: number;
        database: string;
        multiTenancy: string;
        timestamp: string;
        error?: undefined;
    } | {
        status: string;
        latency: number;
        error: any;
        timestamp: string;
        database?: undefined;
        multiTenancy?: undefined;
    }>;
    performanceTest(): Promise<{
        simpleQuery: string;
        countQuery: string;
        status: string;
        multiTenancy: string;
    }>;
}
