'use client';

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger
} from '@/components/ui/drawer';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../lib/clientStore';
import CartItem from './CartItem';
import CartMessage from './CartMessage';
import Payment from './Payment';
import OrderConfirmed from './OrderConfirmed';
import CartProgress from './CartProgress';

export default function CartDrawer() {
  const { cart, checkOutProgress,cartOpen,setCartOpen } = useCartStore();
  return (
    <Drawer open={cartOpen} onOpenChange={setCartOpen}>
      <DrawerTrigger>
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
      <DrawerContent className="fixed bottom-0 left-0 max-h-[70vh] min-h-[50vh]">
        <DrawerHeader>
          <CartMessage />
        </DrawerHeader>
        <CartProgress />
        <div className="overflow-auto p-4">
          {checkOutProgress === 'cart-page' && <CartItem />}
          {checkOutProgress === 'payment-page' && <Payment />}
          {checkOutProgress === 'confirmation-page' && <OrderConfirmed />}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
