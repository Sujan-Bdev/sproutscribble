'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCartStore } from '@/lib/clientStore';
import formatPrice from '@/lib/formatPrice';
import Image from 'next/image';
import { MinusCircle, PlusCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import Lottie from 'lottie-react';
import emptyCart from '@/public/emptybox.json';
import { createId } from '@paralleldrive/cuid2';

export default function CartItem() {
  const { cart, addToCart, removeFromCart } = useCartStore();
  const totalPrice = React.useMemo(() => {
    return cart.reduce((acc, item) => {
      return acc + item.price! * item.variant.quantity;
    }, 0);
  }, [cart]);

  const priceInLetters = React.useMemo(() => {
    return [...totalPrice.toFixed(2).toString()].map(letter => {
      return {
        letter,
        id: createId(),
      };
    });
  }, [totalPrice]);
  return (
    <motion.div animate={{}} initial={{}}>
      {cart.length === 0 && (
        <div className="flex flex-col w-full items-center justify-center">
          <motion.div
            className=""
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-2xl text-muted-foreground text-center">
              Your cart is empty
            </h2>
            <Lottie className="h-64" animationData={emptyCart} loop={true} />
          </motion.div>
        </div>
      )}
      {cart.length > 0 && (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="">Product</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Image</TableHead>
                <TableHead>Quantity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map(item => (
                <TableRow key={item.id}>
                  <TableCell className=""> {item.name} </TableCell>
                  <TableCell>{formatPrice(item.price)} </TableCell>
                  <TableCell className="">
                    <div>
                      <Image
                        className="rounded-md"
                        width={48}
                        height={48}
                        src={item.image}
                        alt={item.name}
                        priority
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-between gap-2">
                      <MinusCircle
                        size={14}
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        onClick={() => {
                          removeFromCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                      />
                      <p className="font-bold text-md">
                        {item.variant.quantity}{' '}
                      </p>
                      <PlusCircle
                        className="cursor-pointer hover:text-muted-foreground duration-300 transition-colors"
                        size={14}
                        onClick={() => {
                          addToCart({
                            ...item,
                            variant: {
                              quantity: 1,
                              variantID: item.variant.variantID,
                            },
                          });
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <motion.div className="flex items-center justify-center relative overflow-hidden my-4">
        <span className="text-md">Total: $</span>
        <AnimatePresence mode='popLayout' >
          {priceInLetters.map((letter, index) => (
            <motion.div key={letter.id}>
              <motion.span
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                exit={{ y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="text-md inline-block"
              >
                {letter.letter}
              </motion.span>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
