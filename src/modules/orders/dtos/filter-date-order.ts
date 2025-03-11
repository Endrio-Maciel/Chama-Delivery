import { z } from "zod";

export const filterOrderSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type FilterOrderSchema = z.infer<typeof filterOrderSchema>;