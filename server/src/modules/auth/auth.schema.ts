import { z } from 'zod';

const calculateAge = (dob: Date): number => {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

export const registerSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(8, 'Password must be at least 8 characters long')
      .regex(/[A-Z]/, 'Password must contain at least 1 uppercase letter')
      .regex(/[0-9]/, 'Password must contain at least 1 number'),
    name: z
      .string({ required_error: 'Name is required' })
      .trim()
      .min(2, 'Name must be between 2 and 60 characters')
      .max(60, 'Name must be between 2 and 60 characters'),
    dob: z.coerce
      .date({ required_error: 'Date of birth is required', invalid_type_error: 'Invalid date of birth' })
      .refine((date) => date <= new Date(), {
        message: 'Date of birth cannot be in the future',
      })
      .refine((date) => calculateAge(date) >= 13, {
        message: 'You must be at least 13 years old to use FinSight',
      })
      .refine((date) => calculateAge(date) <= 100, {
        message: 'Invalid date of birth (must be less than 100 years ago)',
      }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: 'Email is required' })
      .trim()
      .toLowerCase()
      .email('Invalid email address format'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(1, 'Password is required'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
