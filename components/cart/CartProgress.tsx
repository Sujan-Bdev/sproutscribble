'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Check, CreditCard, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/clientStore';

export default function CartProgress() {
  const { checkOutProgress } = useCartStore();
  return (
    <div className="flex items-center justify-center pb-6">
      <div className="w-64 h-3 bg-muted rounded-md relative">
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-between">
          <motion.span
            className="absolute bg-primary top-0 left-0 z-30 ease-in-out h-full"
            initial={{ width: 0 }}
            animate={{
              width:
                checkOutProgress === 'cart-page'
                  ? 0
                  : checkOutProgress === 'payment-page'
                  ? '50%'
                  : '100%',
            }}
          />
          <motion.div
            className="bg-primary rounded-full p-2 z-50"
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
            }}
            transition={{ delay: 0.25 }}
          >
            <ShoppingCart className="text-white " size={14} />
          </motion.div>
          <motion.div
            className="bg-primary rounded-full p-2 z-50"
            initial={{ scale: 0 }}
            animate={{
              scale:
                checkOutProgress === 'payment-page'
                  ? 1
                  : 0 || checkOutProgress === 'confirmation-page'
                  ? 1
                  : 0,
            }}
            transition={{ delay: 0.25 }}
          >
            <CreditCard className="text-white " size={14} />
          </motion.div>
          <motion.div
            className="bg-primary rounded-full p-2 z-50"
            initial={{ scale: 0 }}
            animate={{
              scale: checkOutProgress === 'confirmation-page' ? 1 : 0,
            }}
            transition={{ delay: 0.25 }}
          >
            <Check className="text-white " size={14} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
