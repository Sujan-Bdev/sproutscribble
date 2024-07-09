import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import React from 'react';

export default async function AddProduct() {
  const session = await auth();
  if (session?.user.role !== 'admin') return redirect('/dashboard/settings');
  return <div>Products</div>;
}
