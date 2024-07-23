'use client';

import React, { useMemo } from 'react';
import { Card, CardDescription, CardTitle } from '../ui/card';
import Stars from './Stars';
import { ReviewsWithUser } from '@/lib/infer-type';
import { getReviewAverage } from '@/lib/reviewAverage';
import { Progress } from '@/components/ui/progress';

export default function ReviewChart({
  reviews,
}: {
  reviews: ReviewsWithUser[];
}) {
  const getRatingByStars = useMemo(() => {
    const ratingValues = Array.from({ length: 5 }, () => 0);
    const totalReviews = reviews.length;
    reviews.forEach(review => {
      const starIndex = review.rating - 1;
      if (starIndex >= 0 && starIndex < 5) {
        ratingValues[starIndex]++;
      }
    });
    return ratingValues.map(rating => (rating / totalReviews) * 100);
  }, [reviews]);

  const totalRating = getReviewAverage(reviews.map(r => r.rating));
  return (
    <Card className="p-8 flex flex-col rounded-md gap-4">
      <div className="flex flex-col  gap-2">
        <CardTitle>Product Rating:</CardTitle>
        <CardDescription className='text-lg font-medium'>{totalRating.toFixed(1)} stars</CardDescription>
      </div>
      {getRatingByStars.map((rating, index) => (
        <div key={index} className="flex gap=2 justify-between items-center">
          <p className="text-xs font-medium flex gap-1">
            {index + 1} <span>stars</span>
          </p>
          <Progress value={rating} className='ml-2' />
        </div>
      ))}
    </Card>
  );
}
