import { db } from '@/server';
import { products } from '@/server/schema';
import React from 'react';
import placeholder from '@/public/placeholderimage.svg';
import { DataTable } from './DataTable';
import { columns } from './Columns';

export default async function Products() {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  if (!products) throw new Error('No Products found');

  const dataTable = products.map(product => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholder.src,
    };
  });
  if (!dataTable) throw new Error('No Data Found');

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
}
