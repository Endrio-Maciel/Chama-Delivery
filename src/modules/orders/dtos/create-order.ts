import { z } from 'zod'

export const createOrderSchema = z.object({
    total: z.number().positive(),
    items: z.array(
        z.object({
            productId: z.string().uuid(),
            quantity: z.number().int().positive(),
            price: z.number().positive(),
        })
    )
})

export type CreateOrderDto = z.infer<typeof createOrderSchema>