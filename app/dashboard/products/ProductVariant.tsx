'use client';

import { VariantsWithImagesTags } from '@/lib/infer-type';
import React, { forwardRef, useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VariantSchema, zVariantSchema } from '@/types/variantSchema';
import { InputTags } from './InputTags';
import VariantImages from './VariantImages';
import { useAction } from 'next-safe-action/hooks';
import { createVariant } from '@/server/actions/createVariant';
import { toast } from 'sonner';
import { deleteVariant } from '@/server/actions/deleteVariant';

type VariantProps = {
  children: React.ReactNode;
  editMode: boolean;
  productID?: number;
  variant?: VariantsWithImagesTags;
};
export const ProductVariant = forwardRef<HTMLDivElement, VariantProps>(
  ({ editMode, productID, variant, children }, ref) => {
    const form = useForm<zVariantSchema>({
      resolver: zodResolver(VariantSchema),
      defaultValues: {
        tags: [],
        variantImages: [],
        color: '#000000',
        editMode,
        id: undefined,
        productID,
        productType: 'Black Notebook',
      },
    });

    const [open, setOpen] = useState(false);

    const setEdit = () => {
      if (!editMode) {
        form.reset();
        return;
      }

      if (editMode && variant) {
        form.setValue('editMode', true);
        form.setValue('id', variant.id);
        form.setValue('productID', variant.productID);
        form.setValue('productType', variant.productType);
        form.setValue('color', variant.color);
        form.setValue(
          'tags',
          variant.variantTags.map(tag => tag.tag)
        );
        form.setValue(
          'variantImages',
          variant.variantImages.map(img => ({
            name: img.name,
            size: img.size,
            url: img.url,
          }))
        );
      }
    };

    useEffect(() => {
      setEdit();
    }, []);
    const { execute, status } = useAction(createVariant, {
      onExecute(data) {
        setOpen(false);
      },
      onSuccess(data) {
        if (data.data?.success) {
          toast.success(data.data.success, { duration: 500 });
        }
        if (data.data?.error) {
          toast.error(data.data.error, { duration: 500 });
        }
      },
    });

    const variantAction = useAction(deleteVariant, {
      onExecute(data) {
        setOpen(false);
      },
      onSuccess(data) {
        if (data.data?.success) {
          toast.success(data.data.success, { duration: 500 });
        }
        if (data.data?.error) {
          toast.error(data.data.error, { duration: 500 });
        }
      },
    });

    const onSubmit = (values: zVariantSchema) => {
      execute(values);
    };
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>{children} </DialogTrigger>
        <DialogContent className="lg:max-w-screen-lg overflow-y-scroll max-h-[860px] rounded-md">
          <DialogHeader>
            <DialogTitle>
              {editMode ? 'Edit' : 'Create'} your variant
            </DialogTitle>
            <DialogDescription>
              Manage your product variants here. You can add tags, images, and
              more.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="productType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Pick a title for your variant"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Color</FormLabel>
                    <FormControl>
                      <Input type="color" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Variant Tags</FormLabel>
                    <FormControl>
                      <InputTags {...field} onChange={e => field.onChange(e)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <VariantImages />
              <div className="flex gap-4 items-center justify-center">
                {editMode && variant && (
                  <Button
                    variant={'destructive'}
                    type="button"
                    onClick={e => {
                      e.preventDefault();
                      variantAction.execute({ id: variant.id });
                    }}
                  >
                    Delete Variant
                  </Button>
                )}
                <Button type="submit">
                  {editMode ? 'Update Variant' : 'Create Variant'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }
);

ProductVariant.displayName = 'ProductVariant';
