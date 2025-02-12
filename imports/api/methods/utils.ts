import { z } from "zod";

export const listValidator = z.object({
  options: z.object({
    limit: z.number().optional(),
    skip: z.number().optional(),
    sort: z
      .object({
        field: z.string().optional(),
        direction: z.boolean().optional(),
      })
      .optional(),
  }),
  filters: z.unknown().optional(),
});
