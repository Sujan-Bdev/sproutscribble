'use client';

import React, { useState } from 'react';
import { useCartStore } from '../../lib/clientStore';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { redirect, useSearchParams } from 'next/navigation';

export default function AddCart() {
  const { addToCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const params = useSearchParams();
  const id = Number(params.get('id'));
  const productID = Number(params.get('productID'));
  const price = Number(params.get('price'));
  const title = params.get('title');
  const type = params.get('type');
  const image = params.get('image');

  if (!id || !productID || !price || !title || !type || !image) {
    toast.error('Product not found');
    return redirect('/');
  }
  return (
    <>
      <div className="flex items-center justify-stretch gap-4 my-4">
        <Button
          className="text-primary"
          variant={'secondary'}
          onClick={() => {
            if (quantity > 1) {
              setQuantity(quantity - 1);
            }
          }}
        >
          <Minus size={18} strokeWidth={3} />
        </Button>
        <Button className="flex-1">Quantity: {quantity}</Button>
        <Button
          className="text-primary"
          variant={'secondary'}
          onClick={() => {
            setQuantity(quantity + 1);
          }}
        >
          <Plus />
        </Button>
      </div>
      <Button
        onClick={() => {
          toast.success(`Added ${title + ' ' + type} to your cart!`);
          addToCart({
            id: productID,
            variant: {
              variantID: id,
              quantity,
            },
            price,
            name: title+' '+type,
            image,
          });
        }}
      >
        Add to Cart
      </Button>
    </>
  );
}
