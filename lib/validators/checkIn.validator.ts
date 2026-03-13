import z from "zod";

export const createCheckInSchema = z.object({
  coordinates: z.array(z.number()).length(2, "Coordinates must be [lng, lat]"),
  comment: z
    .string()
    .min(2, "Comment must be at least 2 characters")
    .optional(),

  accuracy: z.number().min(0).max(10000),
});
