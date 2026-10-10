import { z } from 'zod';
import { AgeGroup } from '@prisma/client';

export const patchMeSchema = z.object({
  body: z
    .object({
      ageGroup: z.nativeEnum(AgeGroup, {
        errorMap: () => ({
          message:
            'Invalid ageGroup. Valid options are: TEEN_BEGINNER, TEEN_ADVANCED, YOUNG_ADULT, YOUNG_PROFESSIONAL',
        }),
      }).optional(),
      name: z
        .string()
        .trim()
        .min(2, 'Name must be between 2 and 60 characters')
        .max(60, 'Name must be between 2 and 60 characters')
        .optional(),
    })
    .refine((data) => data.ageGroup !== undefined || data.name !== undefined, {
      message: 'At least one field (ageGroup or name) must be provided to update',
    }),
});

export type PatchMeInput = z.infer<typeof patchMeSchema>['body'];
