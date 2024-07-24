'use client';

import { useCartStore } from '@/lib/clientStore';
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { createPaymentIntent } from '@/server/actions/createPaymentIntent';

export default function PaymentForm({ totalPrice }: { totalPrice: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { cart } = useCartStore();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message!);
      setIsLoading(false);
      return;
    }
    const data = await createPaymentIntent({
      amount: totalPrice * 100,
      cart: cart.map(item => ({
        quantity: item.variant.quantity,
        productID: item.id,
        title: item.name,
        price: item.price,
        image: item.image,
      })),
      currency: 'usd',
    });

    if (data?.data?.error) {
      setErrorMessage(data.data.error);
      setIsLoading(false);
      return;
    }
    if (data?.data?.success) {
      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret: data.data.success.clientSecretID!,
        redirect: 'if_required',
        confirmParams: {
          return_url: 'http://localhost:3000/success',
          receipt_email: data.data.success.user as string,
        },
      });
      if (error) {
        setErrorMessage(error.message!);
        setIsLoading(false);
        return;
      } else {
        setIsLoading(false);
        console.log('save the order');
      }
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: 'shipping' }} />
      <Button disabled={!stripe || !elements}>
        <span>Pay now</span>
      </Button>
    </form>
  );
}
