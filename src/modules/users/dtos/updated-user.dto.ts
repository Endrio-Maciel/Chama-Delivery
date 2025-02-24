import { z } from 'zod'

const updatedUserSchema = z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string()
        .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "O número de telefone fornecido não é válido.")
        .optional(),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres').optional(),
})

export type UpdatedUserSchema = z.infer<typeof updatedUserSchema>