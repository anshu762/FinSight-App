import { z } from 'zod';

export const HookSchema = z.object({
  emoji: z.string().min(1),
  title: z.string().min(2),
  question: z.string().min(5),
  subtitle: z.string().optional(),
});

export const KeyTermSchema = z.object({
  term: z.string().min(1),
  definition: z.string().min(3),
});

export const CardSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(5),
  emoji: z.string().min(1),
  keyTerms: z.array(KeyTermSchema).optional(),
});

export const ChoiceOptionSchema = z.object({
  label: z.string().min(1),
  outcome: z.string().min(5),
  isGood: z.boolean(),
});

export const ChoiceStepSchema = z.object({
  prompt: z.string().min(5),
  options: z.array(ChoiceOptionSchema).min(2).max(3),
});

export const ChoiceScenarioSchema = z.object({
  type: z.literal('choice_scenario'),
  title: z.string().min(2),
  intro: z.string().min(5),
  steps: z.array(ChoiceStepSchema).min(2).max(3),
});

export const CalculatorInputSchema = z.object({
  key: z.string().min(1),
  label: z.string().min(1),
  min: z.number(),
  max: z.number(),
  step: z.number(),
  defaultValue: z.number(),
  prefix: z.string().optional(),
  suffix: z.string().optional(),
});

export const CalculatorSchema = z.object({
  type: z.literal('calculator'),
  title: z.string().min(2),
  intro: z.string().min(5),
  kind: z.enum(['compound_growth', 'net_salary']),
  inputs: z.array(CalculatorInputSchema).min(1),
});

export const QuizSchema = z.object({
  type: z.enum(['mcq', 'true_false', 'fill_blank']),
  question: z.string().min(5),
  options: z.array(z.string().min(1)).min(2),
  correctIndex: z.number().int().min(0),
  explanation: z.string().min(5),
});

export const LessonContentSchema = z
  .object({
    hook: HookSchema,
    cards: z.array(CardSchema).min(3).max(5),
    simulation: z.union([ChoiceScenarioSchema, CalculatorSchema]),
    quiz: QuizSchema,
  })
  .refine(
    (data) => {
      const totalWords = data.cards.reduce(
        (acc, card) => acc + card.body.trim().split(/\s+/).filter(Boolean).length,
        0
      );
      return totalWords <= 200;
    },
    {
      message: 'Total word count across all card bodies must not exceed 200 words',
      path: ['cards'],
    }
  );

export type Hook = z.infer<typeof HookSchema>;
export type Card = z.infer<typeof CardSchema>;
export type ChoiceScenario = z.infer<typeof ChoiceScenarioSchema>;
export type Calculator = z.infer<typeof CalculatorSchema>;
export type Quiz = z.infer<typeof QuizSchema>;
export type LessonContent = z.infer<typeof LessonContentSchema>;
