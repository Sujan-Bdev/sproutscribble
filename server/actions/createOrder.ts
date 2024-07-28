'use server';

import { createSafeActionClient } from 'next-safe-action';
import { and, eq } from 'drizzle-orm';
import { db } from '..';
import { revalidatePath } from 'next/cache';
import { CreateOrderSchema } from '@/types/orderSchema';
import { auth } from '../auth';
import { orderProduct, orders } from '../schema';
const actionClient = createSafeActionClient();

export const createOrder = actionClient
  .schema(CreateOrderSchema)
  .action(async ({ parsedInput: { total, status, products } }) => {
    const user = await auth();
    if (!user) {
      return { error: 'User not found' };
    }

    const order = await db
      .insert(orders)
      .values({
        total,
        status,
        userID: user.user.id,
      })
      .returning();

    const orderProducts = products.map(
      async ({
        productID,
        quantity,
        variantID,
      }: {
        productID: number;
        quantity: number;
        variantID: number;
      }) => {
        const newOrderProduct = await db.insert(orderProduct).values({
          quantity,
          orderID: order[0].id,
          productID: productID,
          productVariantID: variantID,
        });
      }
    );
    return { success: 'Order has been added' };
  });
