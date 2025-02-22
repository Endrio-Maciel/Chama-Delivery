import { z } from 'zod'

export const authSchema = z.object({
    email: z.string().email('E-mail inválido'),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

export type AuthDto = z.infer<typeof authSchema>