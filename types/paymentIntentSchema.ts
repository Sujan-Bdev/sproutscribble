import * as z from 'zod';

export const paymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string(),
  cart: z.array(
    z.object({
      quantity: z.number(),
      productID: z.number(),
      title: z.string(),
      price: z.number(),
      image: z.string(),
    })
  ),
});
