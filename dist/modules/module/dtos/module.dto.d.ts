export declare class CreateModuleDto {
    name: string;
    module: string;
    description?: string;
    slug?: string;
    action_ids?: number[];
}
export declare class UpdateModuleDto {
    name?: string;
    module?: string;
    description?: string;
    slug?: string;
    action_ids?: number[];
}
export declare class BulkDeleteModuleDto {
    ids: number[];
}
