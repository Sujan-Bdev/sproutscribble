'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { ProductSchema, zProductSchema } from '@/types/productSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Tiptap from './TipTap';
import { useAction } from 'next-safe-action/hooks';
import { createProduct } from '@/server/actions/createProduct';
import FormSuccess from '@/components/auth/FormSuccess';
import FormError from '@/components/auth/FormError';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ProductForm() {
  const form = useForm<zProductSchema>({
    resolver: zodResolver(ProductSchema),
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
  });

  const router = useRouter();
  const { execute, status } = useAction(createProduct, {
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        router.push('/dashboard/products');
        toast.success(data.data.success);
      }
    },
    onExecute(data){
      toast.loading('Creating Product')
    }
  });

  const onSubmit = (values: zProductSchema) => {
    execute(values);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Saekdong stripe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Tiptap val={field.value} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-1">
                        <DollarSign
                          size={36}
                          className="p-2 bg-muted rounded-md"
                        />
                        <Input
                          type="number"
                          placeholder="Your price in USD"
                          step="0.1"
                          min={0}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full"
                type="submit"
                disabled={
                  status === 'executing' ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
              >
                Submit
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
