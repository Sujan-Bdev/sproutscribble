'use client';

import React from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { ReviewsSchema, zReviewsSchema } from '@/types/reviewsSchema';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { addReview } from '@/server/actions/addReview';
import { toast } from 'sonner';

export default function ReviewsForm() {
  const params = useSearchParams();
  const productID = Number(params.get('productID'));
  const form = useForm<zReviewsSchema>({
    resolver: zodResolver(ReviewsSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      productID
    },
  });

  const { execute, status } = useAction(addReview, {
    onSuccess(data) {
      if (data.data?.error) {
        toast.error(data.data.error);
      }
      if (data.data?.success) {
        toast.success('Review Added');
        form.reset();
      }
    },
  });

  const onSubmit = (values: zReviewsSchema) => {
    execute({
      comment: values.comment,
      rating: values.rating,
      productID,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="w-full">
          <Button className="w-full font-medium" variant={'secondary'}>
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="How would you describe this product?"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Rating</FormLabel>
                  <FormControl>
                    <Input type="hidden" placeholder="star rating" {...field} />
                  </FormControl>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(value => (
                      <motion.div
                        className="relative cursor-pointer"
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                        key={value}
                      >
                        <Star
                          key={value}
                          onClick={() => {
                            form.setValue('rating', value, {
                              shouldValidate: true,
                            });
                          }}
                          className={cn(
                            'text-primary bg-transparent transition-all ease-in-out duration-500',
                            form.getValues('rating') >= value
                              ? 'fill-primary'
                              : 'fill-muted'
                          )}
                        />
                      </motion.div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              disabled={status === 'executing'}
            >
              {status === 'executing' ? 'Adding Review' : 'Add Review'}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
