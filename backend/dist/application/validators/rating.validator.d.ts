import { z } from 'zod';
export declare const rateItemSchema: z.ZodObject<{
    score: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    score: number;
}, {
    score: number;
}>;
export declare const itemIdSchema: z.ZodObject<{
    itemId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    itemId: string;
}, {
    itemId: string;
}>;
export type RateItemInput = z.infer<typeof rateItemSchema>;
//# sourceMappingURL=rating.validator.d.ts.map