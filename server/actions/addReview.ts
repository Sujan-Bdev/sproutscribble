'use server';
import { auth } from '@/server/auth';

import { createSafeActionClient } from 'next-safe-action';
import { ReviewsSchema } from '../../types/reviewsSchema';
import { and, eq } from 'drizzle-orm';
import { products, reviews } from '../schema';
import { db } from '..';
import { revalidatePath } from 'next/cache';

const actionClient = createSafeActionClient();

export const addReview = actionClient
  .schema(ReviewsSchema)
  .action(async ({ parsedInput: { productID, rating, comment } }) => {
    try {
      const session = await auth();
      if (!session) {
        return { error: 'Please sign in' };
      }
      const reviewExists = await db.query.reviews.findFirst({
        where: and(
          eq(reviews.productID, productID),
          eq(reviews.userID, session.user.id)
        ),
      });
      if (reviewExists) {
        return { error: 'You have already reviewed this product' };
      }
      const newReview = await db
        .insert(reviews)
        .values({
          productID,
          rating,
          comment,
          userID: session.user.id,
        })
        .returning();
      revalidatePath(`/products/${productID}`);
      return { success: newReview[0] };
    } catch (error) {
      return { error: JSON.stringify(error) };
    }
  });
