import * as z from 'zod';

export const ReviewsSchema = z.object({
  productID: z.number(),
  comment: z.string().min(10, {
    message: 'Please add at least 10 characters for a comment',
  }),
  rating: z
    .number()
    .min(1, {
      message: 'Please add at least one star',
    })
    .max(5, { message: 'Please add no more than five star' }),
});

export type zReviewsSchema = z.infer<typeof ReviewsSchema>;
