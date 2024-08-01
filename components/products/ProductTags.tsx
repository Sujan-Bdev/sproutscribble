'use client';

import React from 'react';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ProductTags() {
  const router = useRouter();
  const params = useSearchParams();
  const tag = params.get('tag');
  const setFilter = (tag: string) => {
    if (tag) {
      router.push(`?tag=${tag}`);
    }
    if (!tag) {
      router.push('/');
    }
  };
  return (
    <div className="my-4 flex gap-4 items-center justify-center">
      <Badge
        className={cn(
          'cursor-pointer hover:opacity-100',
          !tag ? 'opacity-100' : 'opacity-50'
        )}
        onClick={() => setFilter('')}
      >
        All
      </Badge>
      <Badge
        onClick={() => setFilter('blue')}
        className={cn(
          'cursor-pointer bg-blue-500 hover:bg-blue-600 hover:opacity-100',
          tag === 'blue' && tag ? 'opacity-100' : 'opacity-50'
        )}
      >
        Blue
      </Badge>
      <Badge
        onClick={() => setFilter('green')}
        className={cn(
          'cursor-pointer bg-green-500 hover:bg-green-600 hover:opacity-100',
          tag === 'green' && tag ? 'opacity-100' : 'opacity-50'
        )}
      >
        Green
      </Badge>
      <Badge
        onClick={() => setFilter('pink')}
        className={cn(
          'cursor-pointer bg-pink-500 hover:bg-pink-600 hover:opacity-100',
          tag === 'purple' && tag ? 'opacity-100' : 'opacity-50'
        )}
      >
        Pink
      </Badge>
    </div>
  );
}
