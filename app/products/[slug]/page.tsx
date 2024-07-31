import { db } from '@/server';
import React from 'react';
import { productVariants } from '@/server/schema';
import { eq } from 'drizzle-orm';
import ProductType from '@/components/products/ProductType';
import { Separator } from '@/components/ui/separator';
import formatPrice from '@/lib/formatPrice';
import ProductPick from '@/components/products/ProductPick';
import Image from 'next/image';
import ProductShowCase from '@/components/products/ProductShowCase';
import Reviews from '@/components/reviews/Reviews';
import { getReviewAverage } from '@/lib/reviewAverage';
import Stars from '@/components/reviews/Stars';
import AddCart from '@/components/cart/AddCart';

export const revalidate = 60
// Return a list of `params` to populate the [slug] dynamic segment
export async function generateStaticParams() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },

    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });

  if (data) {
    const slugID = data.map(variant => ({
      slug: variant.id.toString(),
    }));
    return slugID;
  }
  return [];
}

export default async function Page({ params }: { params: { slug: string } }) {
  const variant = await db.query.productVariants.findFirst({
    where: eq(productVariants.id, Number(params.slug)),
    with: {
      product: {
        with: {
          reviews: true,
          productVariants: {
            with: {
              variantImages: true,
              variantTags: true,
            },
          },
        },
      },
    },
  });
  if (variant) {
    const reviewAverage = getReviewAverage(
      variant?.product.reviews.map(r => r.rating)
    );

    return (
      <main>
        <section className="flex flex-col lg:flex-row gap-4 lg:gap-12">
          <div className="flex-1">
            <ProductShowCase variants={variant.product.productVariants} />
          </div>
          <div className="flex flex-col flex-1">
            <h2 className="text-2xl font-bold">{variant?.product.title}</h2>
            <div>
              <ProductType variants={variant?.product.productVariants} />
              <Stars rating={reviewAverage} totalReviews={variant.product.reviews.length} />
            </div>
            <Separator className="my-2" />
            <p className="text-2xl font-medium py-2">
              {formatPrice(variant.product.price)}
            </p>
            <div
              dangerouslySetInnerHTML={{ __html: variant.product.description }}
            ></div>
            <p className="text-secondary-foreground font-medium my-2 ">
              Available Colors
            </p>

            <div className="flex gap-2">
              {variant.product.productVariants.map(productVariant => (
                <ProductPick
                  key={productVariant.id}
                  id={productVariant.id}
                  productID={productVariant.productID}
                  productType={productVariant.productType}
                  color={productVariant.color}
                  price={variant.product.price}
                  image={productVariant.variantImages[0].url}
                  title={variant.product.title}
                />
              ))}
            </div>
            <AddCart />
          </div>
        </section>
        <Reviews productID={variant.productID} />
      </main>
    );
  }
}
