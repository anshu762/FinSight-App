import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DIRECT_URL: z.string().min(1, 'DIRECT_URL is required'),
  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters long'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  const formattedErrors = parseResult.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  console.error('\n❌ Invalid environment variables configuration:');
  console.error(formattedErrors);
  console.error('\nPlease check your .env file or refer to .env.example.\n');
  process.exit(1);
}

export const env = parseResult.data;
