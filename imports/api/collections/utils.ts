import { z } from "zod";

export const hasId = z.object({ _id: z.string().optional() });
export const hasDates = z.object({ 
  createdAt: z.date().default(() => new Date()), 
  updatedAt: z.date().default(() => new Date()) 
});
export const hasUser = z.object({ userId: z.string() });
