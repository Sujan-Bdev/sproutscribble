"use server"

import { ProductSchema } from '@/types/productSchema';
import { createSafeActionClient } from 'next-safe-action';
import { eq } from 'drizzle-orm';
import { products } from '../schema';
import { db } from '..';
import { revalidatePath } from 'next/cache';

const actionClient = createSafeActionClient();

export const createProduct = actionClient
  .schema(ProductSchema)
  .action(async ({ parsedInput: { id, title, description, price } }) => {
    try {
      if (id) {
        const currentProduct = await db.query.products.findFirst({
          where: eq(products.id, id),
        });
        if (!currentProduct) {
          return { error: 'Product not found' };
        }
        const editedProduct = await db
          .update(products)
          .set({
            title,
            description,
            price,
          })
          .where(eq(products.id, id))
          .returning();
        revalidatePath('/dashboard/products');

        return {
          success: `Product ${editedProduct[0].title} has been updated`,
        };
      }
      if (!id) {
        const newProduct = await db
          .insert(products)
          .values({
            title,
            description,
            price,
          })
          .returning();
        revalidatePath('/dashboard/products');

        return { success: `Product ${newProduct[0].title} has been created` };
      }
    } catch (error) {
      return { error: 'Failed to create product' };
    }
  });
