'use server';

'use server';

import { createSafeActionClient } from 'next-safe-action';
import { eq } from 'drizzle-orm';
import { products, productVariants } from '../schema';
import { db } from '..';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

const actionClient = createSafeActionClient();

export const deleteVariant = actionClient
  .schema(
    z.object({
      id: z.number(),
    })
  )
  .action(async ({ parsedInput: { id } }) => {
    try {
      const existingProductVariant = await db.query.productVariants.findFirst({
        where: eq(productVariants.id, id),
      });
      if (!existingProductVariant) {
        return { error: 'Product Variant not found' };
      }
      const deletedVariant = await db
        .delete(productVariants)
        .where(eq(productVariants.id, id))
        .returning();
      revalidatePath('/dashboard/products');
      return {
        success: `Variant ${deletedVariant[0].productType} has been deleted`,
      };
    } catch (error) {
      return { error: 'Failed to delete variant' };
    }
  });
