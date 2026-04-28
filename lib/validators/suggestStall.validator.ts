import z from "zod";

export const suggestedStallSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long"),

  address: z.string().max(200),

  coordinates: z.tuple([z.number(), z.number()]),

  location: z
    .object({
      type: z.string(),
      coordinates: z.tuple([z.number(), z.number()]),
    })
    .optional(),

  photos: z
    .array(
      z.object({
        url: z.url(),
        publicId: z.string(),
      }),
    )
    .min(1, "At least one photo required"),

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
  createdAt: z.string().optional(),
  _id: z.string().optional(),
});

export type SuggestedStall = z.infer<typeof suggestedStallSchema>;
