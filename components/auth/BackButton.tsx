'use client';
import React from 'react';
import { Button } from '../ui/button';
import Link from 'next/link';

type BackButtonType = {
  href: string;
  label: string;
};
export default function BackButton({ href, label }: BackButtonType) {
  return (
    <>
      <Button variant={'link'} className="font-medium w-full" asChild>
        <Link href={href} aria-label={label}>
          {label}
        </Link>
      </Button>
    </>
  );
}
