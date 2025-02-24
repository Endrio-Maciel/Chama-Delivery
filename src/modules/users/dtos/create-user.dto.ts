import { z } from 'zod'

const createUserSchema = z.object({
    name: z.string().min(1, "O nome não pode estar vazio."),
    email: z.string().email("O e-mail fornecido não é válido."),
    phone: z.string()
        .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "O número de telefone fornecido não é válido."),
    password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres.'),
})

export type CreateUserSchema = z.infer<typeof createUserSchema>