'use client';

import React, { useState, useEffect } from 'react';
import { VariantsWithImagesTags } from '@/lib/infer-type';

import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Autoplay from 'embla-carousel-autoplay';

export default function ProductShowCase({
  variants,
}: {
  variants: VariantsWithImagesTags[];
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get('type') || variants[0].productType;

  useEffect(() => {
    if (!api) {
      return;
    }
    api.on('slidesInView', e => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <Carousel
      setApi={setApi}
      opts={{ loop: true }}
      plugins={[plugin.current]}
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {variants.map(
          variant =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img, index) => {
              return (
                <CarouselItem key={img.url}>
                  {img.url ? (
                    <Image
                      src={img.url}
                      priority
                      className="rounded-md"
                      width={1280}
                      height={720}
                      alt={img.name}
                    />
                  ) : null}
                </CarouselItem>
              );
            })
        )}
      </CarouselContent>
      <div className="flex overflow-clip py-2 gap-4">
        {variants.map(
          variant =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img, index) => {
              return (
                <div key={img.url}>
                  {img.url ? (
                    <Image
                      onClick={() => updatePreview(index)}
                      src={img.url}
                      priority
                      className={cn(
                        index === activeThumbnail[0]
                          ? 'opacity-100'
                          : 'opacity-75',
                        'rounded-md transition-all ease-in-out duration-300 cursor-pointer hover:opacity-75'
                      )}
                      width={72}
                      height={48}
                      alt={img.name}
                    />
                  ) : null}
                </div>
              );
            })
        )}
      </div>
    </Carousel>
  );
}
