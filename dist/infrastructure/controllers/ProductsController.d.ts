import { Request, Response, NextFunction } from 'express';
declare class ProductsController {
    getProducts(req: Request, res: Response, next: NextFunction): Promise<void>;
    getById(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare const productsController: ProductsController;
export {};
