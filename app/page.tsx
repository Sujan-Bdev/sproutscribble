import Algolia from '@/components/products/Algolia';
import Products from '@/components/products/Products';
import ProductTags from '@/components/products/ProductTags';
import { db } from '@/server';
import { productVariants } from '@/server/schema';

export const revalidate = 60 * 60;

export default async function Home() {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (productVariants, { desc }) => [desc(productVariants.id)],
  });
  return (
    <main>
      <Algolia />
      <ProductTags />
      <Products variants={data} />
    </main>
  );
}
