'use server';

import Stripe from 'stripe';
import { createSafeActionClient } from 'next-safe-action';
import { paymentIntentSchema } from '@/types/paymentIntentSchema';
import { auth } from '../auth';
const actionClient = createSafeActionClient();

const stripe = new Stripe(process.env.STRIPE_SECRET!);

export const createPaymentIntent = actionClient
  .schema(paymentIntentSchema)
  .action(async ({ parsedInput: { amount, cart, currency } }) => {
    const user = await auth();
    if (!user) return { error: 'Please login to continue' };
    if (!amount) return { error: 'No Product to checkout' };

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cart: JSON.stringify(cart),
      },
    });

    return {
      success: {
        paymentIntentID: paymentIntent.id,
        clientSecretID: paymentIntent.client_secret,
        user: user.user.email,
      },
    };
  });
