import React from 'react';
import ReviewsForm from './ReviewsForm';
import Review from './Review';
import { db } from '@/server';
import { desc, eq } from 'drizzle-orm';
import { reviews } from '@/server/schema';
import ReviewChart from './ReviewChart';

export default async function Reviews({ productID }: { productID: number }) {
  const data = await db.query.reviews.findMany({
    where: eq(reviews.productID, productID),
    with: {
      user: true,
    },
    orderBy: [desc(reviews.created)],
  });
  return (
    <section className="py-4">
      <div className="flex gap-2 lg:gap-12 justify-stretch lg:flex-row flex-col">
        {/* <ReviewsList productID={productID} /> */}
        <div className="flex-1">
          <h2 className="text-2xl mb-4 font-bold">Product Review</h2>
          <ReviewsForm />
          <Review reviews={data} />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <ReviewChart reviews={data} />
        </div>
      </div>
    </section>
  );
}
