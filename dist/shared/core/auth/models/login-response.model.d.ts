export interface TenantInfo {
    tenant_sub: string;
    slug: string;
    name: string;
    is_default: boolean;
}
export declare class LoginResponseModel {
    token: string;
    user: {
        uuid: string;
        email: string;
        userName: string;
        userLastName: string;
        idsysUser: number;
    };
    tenants?: TenantInfo[];
    defaultTenant?: string;
    constructor(token: string, user: {
        uuid: string;
        email: string;
        userName: string;
        userLastName: string;
        idsysUser: number;
    }, tenants?: TenantInfo[], defaultTenant?: string);
}
