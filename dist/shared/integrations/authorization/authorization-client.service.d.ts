export interface CreateUserInAuthorizationDto {
    uuid: string;
    email: string;
    name: string;
    lastname: string;
    phone?: string | null;
    country_name?: string | null;
    tenantId: string;
    role_in_tenant?: string | null;
}
export interface ExistsResponse {
    exists: boolean;
    email?: string;
    uuid?: string;
}
export interface AuthorizationUserResponse {
    idsysuser: number;
    uuid: string;
    email: string;
    name: string;
    lastname: string;
    phone?: string;
    country_name?: string;
    role: number;
    createat: Date;
}
export declare class AuthorizationClientService {
    private readonly logger;
    private readonly client;
    private readonly baseUrl;
    constructor();
    createUser(data: CreateUserInAuthorizationDto, authToken: string): Promise<AuthorizationUserResponse>;
    existsByEmail(email: string, authToken: string): Promise<boolean>;
    existsByUuid(uuid: string, authToken: string): Promise<boolean>;
    assignTenant(email: string, tenantId: string, roleInTenant: string | undefined, authToken: string): Promise<boolean>;
    private handleError;
}
