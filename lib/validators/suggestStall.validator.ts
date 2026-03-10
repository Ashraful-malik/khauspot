import z from "zod";

export const suggestedStallSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long"),
  category: z.enum([
    "chai",
    "chaat",
    "momos",
    "samosa_snacks",
    "noodles_maggi",
    "regional_food",
    "juice_lassi",
    "sweets_desserts",
    "other",
  ]),
  coordinates: z.array(z.number()).length(2, "Coordinates must be [lng, lat]"),
  photos: z.array(
    z
      .object({
        url: z.url(),
        publicId: z.string().optional(),
      })
      .optional(),
  ),
});
