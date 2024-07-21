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
import { createProduct } from '@/server/actions/createProduct';
import { getProduct } from '@/server/actions/getProduct';
import { ProductSchema, zProductSchema } from '@/types/productSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Tiptap from './TipTap';

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
  const searchParams = useSearchParams();
  const editMode = searchParams.get('id');

  const checkProduct = async (id: number) => {
    if (editMode) {
      const data = await getProduct(id);
      if (data?.error) {
        toast.error(data.error);
        router.push('/dashboard/products');
        return;
      }
      if (data?.success) {
        const id = parseInt(editMode);
        form.setValue('title', data.success.title);
        form.setValue('description', data.success.description);
        form.setValue('price', data.success.price);
        form.setValue('id', data.success.id);
      }
    }
  };

  useEffect(() => {
    if (editMode) {
      checkProduct(parseInt(editMode));
    }
  }, []);

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
  });

  const onSubmit = (values: zProductSchema) => {
    execute(values);
  };
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>
            {editMode ? <span>Edit Product</span> : <span>Create Product</span>}
          </CardTitle>
          <CardDescription>
            {editMode ? (
              <span>Make changes to existing product</span>
            ) : (
              <span>Add a brand new product</span>
            )}
          </CardDescription>
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
                {editMode ? 'Save Changes' : 'Create Product'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
