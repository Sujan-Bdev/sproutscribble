'use client';

import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { motion } from 'framer-motion';
import getStripe from '@/lib/getStripe';
import { useCartStore } from '@/lib/clientStore';
import PaymentForm from './PaymentForm';
import { useTheme } from 'next-themes';

const stripe = getStripe();

export default function Payment() {
  const { cart } = useCartStore();
  const { theme } = useTheme();
  const totalPrice = cart.reduce((acc, item) => {
    return acc + item.price * item.variant.quantity;
  }, 0);

  return (
    <motion.div className="max-w-2xl mx-auto">
      <Elements
        stripe={stripe}
        options={{
          mode: 'payment',
          currency: 'usd',
          amount: totalPrice * 100,
          appearance: { theme: theme === 'dark' ? 'night' : 'flat' },
        }}
      >
        <PaymentForm totalPrice={totalPrice} />
      </Elements>
    </motion.div>
  );
}
