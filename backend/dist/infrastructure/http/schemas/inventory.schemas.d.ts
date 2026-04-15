import { z } from 'zod';
export declare const SearchQuerySchema: z.ZodObject<{
    q: z.ZodString;
}, "strip", z.ZodTypeAny, {
    q: string;
}, {
    q: string;
}>;
export declare const GetItemsQuerySchema: z.ZodObject<{
    tipo: z.ZodOptional<z.ZodEnum<["Héroe", "Arma", "Armadura", "Habilidad", "Ítem", "Épica"]>>;
    rareza: z.ZodOptional<z.ZodEnum<["Común", "Rara", "Épica", "Legendaria"]>>;
    page: z.ZodPipeline<z.ZodEffects<z.ZodDefault<z.ZodString>, number, string | undefined>, z.ZodNumber>;
    limit: z.ZodPipeline<z.ZodEffects<z.ZodDefault<z.ZodString>, number, string | undefined>, z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    page: number;
    tipo?: "Héroe" | "Arma" | "Armadura" | "Habilidad" | "Ítem" | "Épica" | undefined;
    rareza?: "Épica" | "Común" | "Rara" | "Legendaria" | undefined;
}, {
    limit?: string | undefined;
    tipo?: "Héroe" | "Arma" | "Armadura" | "Habilidad" | "Ítem" | "Épica" | undefined;
    rareza?: "Épica" | "Común" | "Rara" | "Legendaria" | undefined;
    page?: string | undefined;
}>;
//# sourceMappingURL=inventory.schemas.d.ts.map