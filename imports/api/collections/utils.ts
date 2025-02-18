import { z } from "zod";

export const hasId = z.object({ _id: z.string().optional() });
export const hasDates = z.object({ createdAt: z.date(), updatedAt: z.date() });
export const hasUser = z.object({ userId: z.string() });
