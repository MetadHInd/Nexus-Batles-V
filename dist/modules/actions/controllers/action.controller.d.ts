import { ActionService } from '../services/action.service';
import { CreateActionDto, UpdateActionDto, BulkDeleteActionDto } from '../dtos/action.dto';
import { ActionModel } from '../models/action.model';
export declare class ActionController {
    private readonly actionService;
    constructor(actionService: ActionService);
    create(createDto: CreateActionDto): Promise<ActionModel>;
    findAll(): Promise<ActionModel[]>;
    findOne(id: number): Promise<ActionModel>;
    update(id: number, updateDto: UpdateActionDto): Promise<ActionModel>;
    delete(id: number): Promise<void>;
    bulkDelete(bulkDeleteDto: BulkDeleteActionDto): Promise<{
        deleted: number;
    }>;
}
