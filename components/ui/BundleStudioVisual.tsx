import Image from 'next/image';
import type { Bundle } from '@/lib/content/products';
import { getBundleStudioImage } from '@/lib/content/bundle-images';
import { cn } from '@/lib/utils';

export interface BundleStudioVisualProps {
  bundle: Bundle;
  priority?: boolean;
  sizes?: string;
  className?: string;
  imageClassName?: string;
}

export function BundleStudioVisual({
  bundle,
  priority = false,
  sizes = '(min-width: 768px) 35vw, 100vw',
  className,
  imageClassName,
}: BundleStudioVisualProps) {
  const image = getBundleStudioImage(bundle.slug);

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden bg-black',
        'before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_50%_58%,rgba(34,211,238,0.14),transparent_48%)]',
        className,
      )}
    >
      {image ? (
        <Image
          src={image.src}
          alt={image.alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn(
            'relative z-10 object-cover transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
            'group-hover/product:scale-[1.025] group-hover/product:saturate-[1.08] group-hover/product:contrast-[1.06]',
            imageClassName,
          )}
        />
      ) : null}
    </div>
  );
}
