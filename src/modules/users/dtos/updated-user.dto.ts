import { z } from 'zod'

const updatedUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional(),
})

export type UpdatedUserSchema = z.infer<typeof updatedUserSchema>