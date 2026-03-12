export declare class RoleModel {
    idrole: number;
    description?: string;
    constructor(data: Partial<RoleModel>);
    static fromEntity(entity: any): RoleModel;
    toEntity(): any;
}
