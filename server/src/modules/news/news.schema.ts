import { z } from 'zod';
import { NewsCategory } from '@prisma/client';

export const listNewsSchema = z.object({
  query: z.object({
    category: z
      .nativeEnum(NewsCategory)
      .or(z.literal('ALL'))
      .optional(),
    cursor: z.string().optional(),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
  }),
});

export type ListNewsQuery = z.infer<typeof listNewsSchema>['query'];

export const newsIdParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Article ID is required'),
  }),
});

export type NewsIdParam = z.infer<typeof newsIdParamSchema>['params'];
