import { number, z } from 'zod'

export const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    PORT: z.coerce.number().default(3000),
})

export type Env = z.infer<typeof envSchema>