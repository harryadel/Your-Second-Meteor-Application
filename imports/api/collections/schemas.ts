import { z } from "zod";
import { ProductType } from "../types/products";

export const productInsertSchema = z.object({
  name: z.string(),
  type: z.nativeEnum(ProductType),
  categoryIds: z.array(z.string()).optional(),
});

export const categoryInsertSchema = z.object({
  title: z.string(),
});