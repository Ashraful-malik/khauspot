import { z } from "zod";

export const reportSchema = z.object({
  reason: z.enum([
    "does_not_exist",
    "wrong_location",
    "spam",
    "duplicate",
    "other",
  ]),
});
