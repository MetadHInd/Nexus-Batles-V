export declare class UsersExampleController {
    getUsers(user: any): Promise<{
        message: string;
        data: {
            requiredRole: string;
            currentUser: {
                id: any;
                authRole: any;
                localRole: any;
                isSuperAdmin: any;
            };
        };
    }>;
    getMyProfile(user: any): Promise<{
        message: string;
        data: {
            user: {
                id: any;
                name: any;
                email: any;
                authorizationRole: any;
                localRole: any;
                isAIA: any;
                branches: any;
            };
        };
    }>;
    createUser(userData: any, user: any): Promise<{
        message: string;
        data: {
            note: string;
            createdBy: {
                id: any;
                role: any;
            };
            userData: any;
        };
    }>;
    updateUser(id: number, updateData: any, user: any): Promise<{
        message: string;
        data: {
            targetUserId: number;
            note: string;
            updatedBy: {
                id: any;
                authRole: any;
                canModifyAIA: any;
            };
            updateData: any;
        };
    }>;
    deleteUser(id: number, user: any): Promise<{
        message: string;
        data: {
            targetUserId: number;
            note: string;
            deletedBy: {
                id: any;
                authRole: any;
                localRole: any;
            };
        };
    }>;
    changeUserRole(id: number, roleData: {
        newRoleId: number;
    }, user: any): Promise<{
        message: string;
        data: {
            targetUserId: number;
            newRoleId: number;
            note: string;
            changedBy: {
                id: any;
                localRole: any;
            };
        };
    }>;
    getManagerData(user: any): Promise<{
        message: string;
        data: {
            note: string;
            manager: {
                id: any;
                localRole: any;
                authRole: any;
            };
        };
    }>;
    getSupervisorData(user: any): Promise<{
        message: string;
        data: {
            note: string;
            supervisor: {
                id: any;
                authRole: any;
                hasGlobalAccess: any;
            };
        };
    }>;
    updateSensitiveData(id: number, sensitiveData: any, user: any): Promise<{
        message: string;
        data: {
            targetUserId: number;
            note: string;
            updatedBy: {
                id: any;
                authRole: any;
                localRole: any;
                meets: {
                    authRequirement: boolean;
                    localRequirement: boolean;
                };
            };
        };
    }>;
}
