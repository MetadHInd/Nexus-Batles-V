import { Request, Response } from 'express';
import { RatingService } from '../../../domain/services/RatingService';
interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email?: string;
        rol?: string;
    };
}
export declare class RatingController {
    private ratingService;
    constructor(ratingService: RatingService);
    rateProduct: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
    getProductRating: (req: AuthenticatedRequest, res: Response) => Promise<Response<any, Record<string, any>>>;
}
export {};
//# sourceMappingURL=RatingController.d.ts.map