import { z } from 'zod'

export const updatedRestaurantSchema = z.object({
    name: z.string().min(3).optional(),
    ownerId: z.string().optional(),
    restaurantPhone: z.string()
            .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "O número de telefone fornecido não é válido.")
            .optional(),
    description: z.string().optional(),
    address: z.string().optional(),
})

export type UpdatedRestaurantSchema = z.infer<typeof updatedRestaurantSchema>