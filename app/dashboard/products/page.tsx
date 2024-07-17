import { db } from '@/server';
import { products } from '@/server/schema';
import React from 'react';
import placeholder from '@/public/placeholderimage.svg';
import { DataTable } from './DataTable';
import { columns } from './Columns';

export default async function Products() {
  const products = await db.query.products.findMany({
    with: {
      productVariants: {
        with: {
          variantImages:true,
          variantTags:true
        }
      }
    },
    orderBy: (products, { desc }) => [desc(products.id)]
  });
  console.log(`Product data: ${products}`)

  if (!products) throw new Error('No Products found');

  const dataTable = products.map(product => {
    if (product.productVariants.length === 0) {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholder.src,
    }}
    const image = product.productVariants[0].variantImages[0].url;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
    };
  });
  if (!dataTable) throw new Error('No Data Found');

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
