import React from 'react';
import ReviewsForm from './ReviewsForm';

export default async function Reviews({ productID }: { productID: number }) {
  return (
    <section className="py-8">
      <h2 className="text-2xl mb-4 font-bold">Product Review</h2>
      <div>
        {/* <ReviewsList productID={productID} /> */}
      <ReviewsForm />
      </div>
    </section>
  );
}
