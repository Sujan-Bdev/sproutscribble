import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Variant = {
  variantID: number;
  quantity: number;
};

export type CartItem = {
  name: string;
  image: string;
  id: number;
  variant: Variant;
  price: number;
};

export type CartState = {
  cart: CartItem[];
  checkOutProgress: 'cart-page' | 'payment-page' | 'confirmation-page';
  setCheckOutProgress: (
    val: 'cart-page' | 'payment-page' | 'confirmation-page'
  ) => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (item: CartItem) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (val: boolean) => void;
};
export const useCartStore = create<CartState>()(
  persist(
    set => ({
      cart: [],
      cartOpen: false,
      setCartOpen: val => set({ cartOpen: val }),
      checkOutProgress: 'cart-page',
      clearCart: () => set({ cart: [] }),
      setCheckOutProgress: val => set(state => ({ checkOutProgress: val })),
      addToCart: item =>
        set(state => {
          const existingItem = state.cart.find(
            cartItem => cartItem.variant.variantID === item.variant.variantID
          );
          if (existingItem) {
            const updatedCart = state.cart.map(cartItem => {
              if (cartItem.variant.variantID === item.variant.variantID) {
                return {
                  ...cartItem,
                  variant: {
                    ...cartItem.variant,
                    quantity: cartItem.variant.quantity + item.variant.quantity,
                  },
                };
              }
              return cartItem;
            });
            return { cart: updatedCart };
          } else {
            return {
              cart: [
                ...state.cart,
                {
                  ...item,
                  variant: {
                    variantID: item.variant.variantID,
                    quantity: item.variant.quantity,
                  },
                },
              ],
            };
          }
        }),
      removeFromCart: item =>
        set(state => {
          const updatedCart = state.cart.map(cartItem => {
            if (cartItem.variant.variantID === item.variant.variantID) {
              return {
                ...cartItem,
                variant: {
                  ...cartItem.variant,
                  quantity: cartItem.variant.quantity - 1,
                },
              };
            }
            return cartItem;
          });
          return {
            cart: updatedCart.filter(item => item.variant.quantity > 0),
          };
        }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
