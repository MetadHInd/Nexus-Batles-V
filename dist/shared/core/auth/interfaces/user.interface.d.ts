export interface IUser {
    idsysUser: number;
    uuid: string | null;
    userName: string | null;
    userLastName: string | null;
    userEmail: string | null;
    userPhone: string | null;
    userPassword: string | null;
    role: number | null;
    sysuserstatus_idsysuserstatus: number | null;
    created_at: Date | null;
    updated_at: Date | null;
    is_active: boolean | null;
    loggedbyfirsttime: boolean | null;
    activation_token: string | null;
    activation_expires: Date | null;
    reset_password_token: string | null;
    reset_password_expires: Date | null;
}
export interface IRole {
    idrole: number;
    description: string | null;
}
export interface IUserWithRole extends IUser {
    role_sysUser_roleTorole: IRole | null;
}
export type IUserPublic = Pick<IUser, 'uuid' | 'userName' | 'userLastName' | 'userEmail'> & {
    role: Pick<IRole, 'idrole' | 'description'> | null;
};
export interface IUserProfile {
    userId: number;
    uuid: string;
    email: string;
    name: string | null;
    lastName: string | null;
    lastname: string | null;
    fullName: string;
    role: {
        id: number | null;
        description: string;
    };
    roleId: number | null;
    roleName: string;
    isActive: boolean;
    status: number;
    statusName: string;
    branches: unknown[];
    getPermissions: () => IUserPermissions;
}
export interface IUserPermissions {
    canAccessBranch: (branchId: number) => boolean;
    canManageBranch: (branchId: number) => boolean;
    hasRole: (role: string) => boolean;
    isManager: boolean;
    managedBranches: number[];
    accessibleBranches: number[];
}
export interface IJWTUserResponse {
    userId: number | string;
    uuid: string;
    username: string | null;
    email: string;
    firstName: string | null;
    lastName: string | null;
    fullName: string;
    phoneNumber?: string | null;
    authorizationRole: number;
    authorizationRoleName: string;
    localRole: number | null;
    localRoleName: string;
    role: {
        id: number | null;
        description: string;
    };
    roleName: string;
    status: number;
    statusName: string;
    branches: unknown[];
    tenants: ITenant[];
    permissions: IUserPermissions;
    isAIAUser: boolean;
    isSuperAdmin: boolean;
    isGlobalAdmin: boolean;
    isAssistant: boolean;
    profile: IUserProfile | null;
    isGuest?: boolean;
    isCustomer?: boolean;
    sessionId?: number | string;
    sessionUuid?: string;
    customerId?: number;
    userType?: 'user' | 'guest' | 'customer' | 'admin';
    loginAt?: string | Date;
    tenant_id?: string;
}
export interface IRestaurant {
    id: number;
    uuid: string;
    name: string;
    database_connection: string;
    role_in_restaurant: string;
    is_owner: boolean;
    can_create_users: boolean;
}
export interface ITenant {
    id: number;
    uuid: string;
    sub: string;
    name: string;
    slug: string;
    is_active: boolean;
    is_default: boolean;
    role_in_tenant?: string | null;
    permissions?: any;
}
export type IUserSafe = Omit<IUser, 'userPassword' | 'activation_token' | 'reset_password_token'>;
export type IUserCreate = Pick<IUser, 'userEmail' | 'userName' | 'userLastName' | 'userPhone'> & {
    userPassword: string;
    role?: number;
};
export type IUserUpdate = Partial<Pick<IUser, 'userName' | 'userLastName' | 'userPhone' | 'role'>>;
