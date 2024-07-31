'use client';

import { ReviewsWithUser } from '@/lib/infer-type';
import { motion } from 'framer-motion';
import React from 'react';
import Image from 'next/image';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDistance, subDays } from 'date-fns';
import Stars from './Stars';

export default function Review({ reviews }: { reviews: ReviewsWithUser[] }) {
  return (
    <motion.div className="flex flex-col gap-4">
      {reviews.length=== 0 && <p className='py-2 text-md font-medium'>No reviews yet</p>}
      {reviews.map(review => (
        <Card key={review.id} className="p-4">
          <div className="flex gap-2 items-center">
            {review.user.image ? (
              <Image
                className="rounded-full"
                width={32}
                height={32}
                src={review.user.image!}
                alt={review.user.name!}
              />
            ) : (
              <div className="">
                <p className="text-sm font-bold">
                  {review.user?.name
                    ?.split(' ')
                    .map(name => name[0])
                    .join('')
                    .toUpperCase()}
                </p>
              </div>
            )}

            <div className="">
              <p className="text-sm font-bold">{review.user.name} </p>
              <div className='flex items-center gap-2'>
                <Stars rating={review.rating} />
                <p className="text-xs text-bold text-muted-foreground">
                  {formatDistance(subDays(review.created!, 0), new Date())}{' '}
                </p>
              </div>
            </div>
          </div>

          <p className="py-2 font-normal"> {review.comment} </p>
        </Card>
      ))}
    </motion.div>
  );
}
