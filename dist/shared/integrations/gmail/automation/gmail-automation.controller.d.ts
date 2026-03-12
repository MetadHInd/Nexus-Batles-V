import { GmailAutomationService, EmailFilter, EmailAction } from './gmail-automation.service';
export declare class RegisterUserDto {
    userId: string;
    accessToken: string;
    refreshToken: string;
    filters?: EmailFilter[];
    actions?: EmailAction[];
}
export declare class UpdateConfigDto {
    filters?: EmailFilter[];
    actions?: EmailAction[];
}
export declare class CreateFilterDto {
    name: string;
    query: string;
    enabled: boolean;
}
export declare class CreateActionDto {
    name: string;
    type: 'webhook' | 'function' | 'database' | 'notification' | 'mark_read';
    config: any;
    enabled: boolean;
}
export declare class GmailAutomationController {
    private readonly automationService;
    private readonly logger;
    constructor(automationService: GmailAutomationService);
    registerUser(registerDto: RegisterUserDto): Promise<{
        success: boolean;
        message: string;
    }>;
    unregisterUser(userId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    testUserConfig(userId: string): Promise<{
        success: boolean;
        message: string;
        results?: any;
    }>;
    forceCheck(): Promise<{
        success: boolean;
        message: string;
    }>;
    getServiceStatus(): Promise<any>;
    setupSimpleLogging(body: {
        userId: string;
        accessToken: string;
        refreshToken: string;
    }): Promise<any>;
    setupSupportAutomation(body: {
        userId: string;
        accessToken: string;
        refreshToken: string;
    }): Promise<any>;
}
