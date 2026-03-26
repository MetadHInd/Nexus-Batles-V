import { z } from 'zod';

export const SearchQuerySchema = z.object({
  q: z.string().min(4, 'La búsqueda debe tener al menos 4 caracteres'),
});

export const GetItemsQuerySchema = z.object({
  tipo:   z.enum(['Héroe', 'Arma', 'Armadura', 'Habilidad', 'Ítem', 'Épica']).optional(),
  rareza: z.enum(['Común', 'Rara', 'Épica', 'Legendaria']).optional(),
  page:  z.string().default('1').transform(Number).pipe(z.number().min(1)),
  limit: z.string().default('16').transform(Number).pipe(z.number().min(1).max(100)),
});