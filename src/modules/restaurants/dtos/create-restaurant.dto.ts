import { z } from 'zod'

export const createRestaurantSchema = z.object({
    name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
    ownerId: z.string(),
    restaurantPhone: z.string()
            .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "O número de telefone fornecido não é válido."),
    description: z.string().optional(),
    address: z.string(),
})

export type CreateRestaurantDto = z.infer<typeof createRestaurantSchema>