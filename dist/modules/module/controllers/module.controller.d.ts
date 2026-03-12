import { ModuleService } from '../services/module.service';
import { CreateModuleDto, UpdateModuleDto, BulkDeleteModuleDto } from '../dtos/module.dto';
import { ModuleModel } from '../models/module.model';
export declare class ModuleController {
    private readonly moduleService;
    constructor(moduleService: ModuleService);
    create(createDto: CreateModuleDto): Promise<ModuleModel>;
    findAll(): Promise<ModuleModel[]>;
    findByUuid(uuid: string): Promise<ModuleModel>;
    findOne(id: number): Promise<ModuleModel>;
    update(id: number, updateDto: UpdateModuleDto): Promise<ModuleModel>;
    delete(id: number): Promise<void>;
    bulkDelete(bulkDeleteDto: BulkDeleteModuleDto): Promise<{
        deleted: number;
    }>;
}
