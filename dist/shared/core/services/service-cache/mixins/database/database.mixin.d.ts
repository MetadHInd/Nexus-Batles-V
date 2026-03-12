import { PrismaService } from '../../../../../database/prisma.service';
declare const DatabaseObject: {
    readonly Prisma: PrismaService;
    readonly Firestore: any;
    getStatus(): {
        instanceExists: boolean;
        initializationAttempts: number;
        lastError: string | null;
        isInitializing: boolean;
        instanceType: string;
        allProperties: number;
        hasModels: number;
        sampleModels: string[];
        hasQueryRaw: boolean;
        hasSysUser: boolean;
        hasTransactionStatus: boolean;
        globalContextAvailable: boolean;
        accelerateEnabled: boolean;
        instanceReady: boolean;
    };
    setGlobalInstance(instance: PrismaService): void;
    _resetInstance(): void;
    hasModel(modelName: string): boolean;
    diagnose(): {
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    };
};
export declare const Database: typeof DatabaseObject & PrismaService;
export interface DatabaseInterface {
    Prisma: PrismaService;
    Firestore: any;
    getStatus(): any;
    setGlobalInstance(instance: PrismaService): void;
    _resetInstance(): void;
    hasModel(modelName: string): boolean;
    diagnose(): any;
    [key: string]: any;
}
export declare const WithPrisma: null;
export declare const WithFirestore: null;
export type IWithDatabase = DatabaseInterface;
export {};
