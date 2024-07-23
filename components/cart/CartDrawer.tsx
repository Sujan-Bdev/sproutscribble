'use client';

import React from 'react';
import { useCartStore } from '../../lib/clientStore';
import { ShoppingBag } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import CartItem from './CartItem';

export default function CartDrawer() {
  const { cart } = useCartStore();
  return (
    <Drawer>
      <DrawerTrigger >
        <div className="relative px-2">
          <AnimatePresence>
            {cart.length > 0 && (
              <motion.span
                animate={{ scale: 1, opacity: 1 }}
                initial={{ opacity: 0, scale: 0 }}
                exit={{ scale: 0 }}
                className="absolute flex items-center justify-center -top-1 -right-0.5 w-4 h-4 dark:bg-primary bg-primary text-white text-xs font-bold rounded-full"
              >
                {cart.length}
              </motion.span>
            )}
          </AnimatePresence>
        <ShoppingBag />
        </div>
      </DrawerTrigger>
      <DrawerContent className='min-h-50vh'>
        <DrawerHeader>
          <h1>Cart Progress</h1>
        </DrawerHeader>
        <div className='overflow-auto p-4'>

        </div>
        <CartItem />
        {/* <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
}
