import * as z from 'zod';

export const CreateOrderSchema = z.object({
  total: z.number(),
  status: z.string(),
  paymentIntentID: z.string(),
  products: z.array(
    z.object({
      productID: z.number(),
      variantID: z.number(),
      quantity: z.number(),
    })
  ),
});

// export type UserType = z.infer<typeof LoginSchema>;
