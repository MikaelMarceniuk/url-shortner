import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['DEV', 'PRD']).default('DEV'),
  PORT: z.coerce.number().default(3333),

  BETTER_AUTH_SECRET: z
    .string('BETTER_AUTH_SECRET is required')
    .min(1, 'BETTER_AUTH_SECRET cannot be empty'),
  BETTER_AUTH_URL: z.url('BETTER_AUTH_URL must be a valid URL'),

  MONGODB_URL: z.url('MONGODB_URL must be a valid MongoDB connection string'),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('[Config] Invalid environment variables:')
  console.error(JSON.stringify(z.treeifyError(parsedEnv.error), null, 2))
  process.exit(1)
}

export const env = parsedEnv.data
