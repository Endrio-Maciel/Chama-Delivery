import { z } from "zod";
import { OrderStatus } from "../enums/order-status.enum"; 

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type UpdateOrderStatusDto = z.infer<typeof updateOrderStatusSchema>;