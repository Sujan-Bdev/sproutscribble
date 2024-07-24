'use client';
import { useCartStore } from '@/lib/clientStore';
import { motion } from 'framer-motion';
import React from 'react';
import { DrawerDescription, DrawerTitle } from '../ui/drawer';
import { ArrowLeft } from 'lucide-react';

export default function CartMessage() {
  const { checkOutProgress, setCheckOutProgress } = useCartStore();
  return (
    <motion.div animate={{ opacity: 1, x: 0 }} initial={{ opacity: 0, x: 10 }} className='text-center'>
      <DrawerTitle>
        {checkOutProgress === 'cart-page' ? 'Your Cart Items' : null}
        {checkOutProgress === 'payment-page' ? 'Choose a payment method' : null}
        {checkOutProgress === 'confirmation-page' ? 'Order Confirmed' : null}
      </DrawerTitle>
      <DrawerDescription className="py-1">
        {checkOutProgress === 'cart-page' ? 'View and edit your bag.' : null}
        {checkOutProgress === 'payment-page' ? (
          <span
            className="flex gap-1 items-center justify-center cursor-pointer hover:text-primary"
            onClick={() => setCheckOutProgress('cart-page')}
          >
            <ArrowLeft size={14} />
            Head back to cart
          </span>
        ) : null}
        {checkOutProgress === 'confirmation-page' ? 'Order Confirmed' : null}
      </DrawerDescription>
    </motion.div>
  );
}
