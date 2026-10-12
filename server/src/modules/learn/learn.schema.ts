import { z } from 'zod';

export const completeLessonSchema = z.object({
  body: z.object({
    quizAttempts: z
      .number({ required_error: 'quizAttempts is required' })
      .int('quizAttempts must be an integer')
      .min(1, 'quizAttempts must be at least 1')
      .max(3, 'quizAttempts cannot exceed 3'),
    hintsUsed: z
      .number({ required_error: 'hintsUsed is required' })
      .int('hintsUsed must be an integer')
      .min(0, 'hintsUsed cannot be negative')
      .max(10, 'hintsUsed cannot exceed 10'),
  }),
});

export type CompleteLessonInput = z.infer<typeof completeLessonSchema>['body'];
