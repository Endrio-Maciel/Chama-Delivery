import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, "O nome deve ter pelo menos 3 caracteres"),
  description: z.string().optional(),
  price: z.number().positive("O preço deve ser positivo"),
  imageUrl: z.string().url("URL inválida").optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
