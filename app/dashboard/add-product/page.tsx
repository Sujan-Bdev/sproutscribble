import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import ProductForm from './ProductForm';

export default async function AddProduct() {
  const session = await auth();
  if (session?.user.role !== 'admin') return redirect('/dashboard/settings');

  return <ProductForm />;
}
