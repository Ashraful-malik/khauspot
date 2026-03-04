import { z } from "zod";
export const reviewsSchema = z.object({
  rating: z
    .number()
    .min(1, "Rating must be between >=1")
    .max(5, "Rating must be between <=5"),
  text: z.string().max(500).optional(),
  photos: z
    .array(
      z.object({
        url: z.url(),
        publicId: z.string(),
      }),
    )
    .optional(),
});
