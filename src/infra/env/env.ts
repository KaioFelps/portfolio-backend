import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string(),
  DIRECT_URL: z.string(),
  PORT: z.coerce.number().optional().default(3000),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  NODE_ENV: z.string().optional().default('development'),
  DOMAIN: z.string(),
  ROOTUSER_PASSWORD: z.string(),
  ROOTUSER_EMAIL: z.string().email(),
  ROOTUSER_NAME: z.string(),
});

export type Env = z.infer<typeof envSchema>;
