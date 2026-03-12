import { ModulesContainer, Reflector } from '@nestjs/core';
export interface EndpointInfo {
    controller: string;
    method: string;
    path: string;
    httpMethod: string;
    fullPath: string;
}
export interface EndpointStats {
    totalEndpoints: number;
    endpointsByController: Record<string, number>;
    endpointsByHttpMethod: Record<string, number>;
    endpointsByModule: Record<string, number>;
    allEndpoints: EndpointInfo[];
    lastUpdated: string;
}
export declare class EndpointCounterService {
    private readonly modulesContainer;
    private readonly reflector;
    constructor(modulesContainer: ModulesContainer, reflector: Reflector);
    countEndpoints(): EndpointStats;
    getEndpointSummary(): {
        total: number;
        byHttpMethod: Record<string, number>;
        topControllers: Array<{
            name: string;
            count: number;
        }>;
        lastUpdated: string;
    };
    private buildFullPath;
    private getModuleDisplayName;
    searchEndpoints(searchTerm: string): EndpointInfo[];
    private mapHttpMethodToString;
}
