'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/button';
import { useCartStore } from '@/lib/clientStore';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import orderConfirmed from '@/public/orderConfirmed.json';

export default function OrderConfirmed() {
  const { setCheckOutProgress, setCartOpen } = useCartStore();
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.35 }}
      >
        <Lottie className="h-56 my-4" animationData={orderConfirmed} />
      </motion.div>
      <h2 className="text-2xl font-medium">Thank you for your purchase!</h2>
      <Link href="/dashboard/orders">
        <Button
        variant={'secondary'}
          onClick={() => {
            setCheckOutProgress('cart-page');
            setCartOpen(false);
          }}
        >
          View your order
        </Button>
      </Link>
    </div>
  );
}
