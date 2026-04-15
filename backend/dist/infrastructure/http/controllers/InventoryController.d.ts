import { Request, Response, NextFunction } from 'express';
import { SearchItems } from '../../../application/usecases/inventory/SearchItem';
import { GetItems } from '../../../application/usecases/inventory/GetItem';
import { GetItemById } from '../../../application/usecases/inventory/GetItemById';
import { DeleteItem } from '../../../application/usecases/inventory/DeleteItem';
import { AuthRequest } from '../middlewares/auth.middleware';
export declare class InventoryController {
    private readonly searchItems;
    private readonly getItems;
    private readonly getItemById;
    private readonly deleteItem;
    constructor(searchItems: SearchItems, getItems: GetItems, getItemById: GetItemById, deleteItem: DeleteItem);
    search: (req: Request, res: Response, next: NextFunction) => Promise<void>;
    list: (req: Request, res: Response) => Promise<void>;
    getById: (req: Request<{
        id: string;
    }>, res: Response, next: NextFunction) => Promise<void>;
    delete: (req: AuthRequest & Request<{
        id: string;
    }>, res: Response, next: NextFunction) => Promise<void>;
}
//# sourceMappingURL=InventoryController.d.ts.map