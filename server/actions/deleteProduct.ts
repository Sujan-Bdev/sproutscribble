'use server';

'use server';

import { ProductSchema } from '@/types/productSchema';
import { createSafeActionClient } from 'next-safe-action';
import { eq } from 'drizzle-orm';
import { products } from '../schema';
import { db } from '..';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const actionClient = createSafeActionClient();

export const deleteProduct = actionClient
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    try {
      const existingProduct = await db.query.products.findFirst({
        where: eq(products.id, id),
      });
      if (!existingProduct) {
        return { error: 'Product not found' };
      }
      const deletedProduct = await db
        .delete(products)
        .where(eq(products.id, id))
        .returning();
      revalidatePath('/dashboard/products');
      return { success: `Product ${deletedProduct[0].title} has been deleted` };
    } catch (error) {
      return { error: 'Failed to delete product' };
    }
  });
