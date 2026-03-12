export declare class HealthController {
    getHealth(): {
        status: string;
        timestamp: string;
        uptime: number;
        environment: string;
        version: string;
        database: {
            connected: boolean;
            dev_connected: boolean;
        };
        services: {
            auth: boolean;
            smtp: boolean;
            gemini: boolean;
            openai: boolean;
            stripe: boolean;
        };
    };
    getReadiness(): {
        status: string;
        missing_services: string[];
        timestamp: string;
        services_loaded?: undefined;
    } | {
        status: string;
        timestamp: string;
        services_loaded: number;
        missing_services?: undefined;
    };
    getLiveness(): {
        status: string;
        timestamp: string;
        pid: number;
        memory: NodeJS.MemoryUsage;
    };
}
