import { z } from 'zod'

export const envSchema = z.object({
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string(),
    JWT_REFRESH_SECRET: z.string(),
})

export type Env = z.infer<typeof envSchema>