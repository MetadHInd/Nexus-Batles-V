export interface SchemaContext {
    tenantUuid: string;
    schemaName: string;
    tenantName: string;
    userUuid: string;
    roleInTenant?: string;
}
export declare class SchemaContextService {
    private readonly asyncLocalStorage;
    run<T>(context: SchemaContext, callback: () => T): T;
    getContext(): SchemaContext | undefined;
    getCurrentSchema(): string | undefined;
    getCurrentTenantUuid(): string | undefined;
    hasContext(): boolean;
    clearContext(): void;
}
