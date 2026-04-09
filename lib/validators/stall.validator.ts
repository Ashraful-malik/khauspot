import { z } from "zod";

export const createStallSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long"),

  address: z.string().max(200).optional(),

  coordinates: z.array(z.number()).length(2, "Coordinates must be [lng, lat]"),

  photos: z
    .array(
      z.object({
        url: z.url(),
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
});

export const updateStallSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long")
    .optional(),

  address: z.string().max(200).optional(),
});
