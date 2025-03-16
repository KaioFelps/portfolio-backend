import { z } from 'zod';

export const envSchema = z
  .object({
    DATABASE_URL: z.string(),
    DIRECT_URL: z.string(),
    PORT: z.coerce.number().optional().default(3000),
    JWT_PRIVATE_KEY: z.string(),
    JWT_PUBLIC_KEY: z.string(),
    DOMAIN: z.string(),
    ROOTUSER_PASSWORD: z.string(),
    ROOTUSER_EMAIL: z.string().email(),
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
