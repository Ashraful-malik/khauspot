import { z } from "zod";

export const createStallSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long"),

  address: z.string().max(200),

  coordinates: z.tuple([z.number(), z.number()]),
  photos: z
    .array(
      z.object({
        url: z.url(),
        publicId: z.string(),
      }),
    )
    .min(1, "At least one photo required"),

  category: z
    .string()
    .min(1, "Category is required")
    .refine(
      (val) =>
        [
          "chai",
          "chaat",
          "momos",
          "samosa_snacks",
          "noodles_maggi",
          "regional_food",
          "juice_lassi",
          "sweets_desserts",
          "other",
        ].includes(val),
      {
        message: "Invalid category selected",
      },
    ),
});
export type StallInput = z.infer<typeof createStallSchema>;

export const updateStallSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long")
    .optional(),
});
