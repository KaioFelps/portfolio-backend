import { z } from 'zod';

export const envSchema = z
  .object({
    CORS_ALLOWED_ORIGINS: z
      .string()
      .transform((str) => str.split(',').map((origin) => origin.trim()))
      .pipe(z.array(z.url())),
    DATABASE_URL: z.string(),
    DIRECT_URL: z.string(),
    PORT: z.coerce.number().optional().default(3000),
    JWT_PRIVATE_KEY: z.string(),
    JWT_PUBLIC_KEY: z.string(),
    DOMAIN: z.string(),
    COOKIE_DOMAIN: z.string().optional(),
    ROOTUSER_PASSWORD: z.string(),
    ROOTUSER_EMAIL: z.email(),
    ROOTUSER_NAME: z.string(),
    NODE_ENV: z
      .enum(['development', 'production', 'test'])
      .optional()
      .default('development'),
    RUN_DB_SEED: z.enum(['true', 'false']).optional().default('false'),
  })
  .transform((vars) => ({
    ...vars,
    RUN_DB_SEED: vars.RUN_DB_SEED === 'true',
  }));

export type Env = z.infer<typeof envSchema>;
