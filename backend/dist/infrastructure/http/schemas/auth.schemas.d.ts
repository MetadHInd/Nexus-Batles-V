import { z } from 'zod';
export declare const RegisterSchema: z.ZodObject<{
    nombres: z.ZodString;
    apellidos: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    apodo: z.ZodString;
    avatar: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    nombres: string;
    apellidos: string;
    apodo: string;
    avatar?: string | undefined;
}, {
    password: string;
    email: string;
    nombres: string;
    apellidos: string;
    apodo: string;
    avatar?: string | undefined;
}>;
export declare const LoginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
}, {
    password: string;
    email: string;
}>;
//# sourceMappingURL=auth.schemas.d.ts.map