import React, {useState} from 'react';
import {Layers} from 'lucide-react';

interface ServiceVisualImageProps {
  src: string;
  alt: string;
  title: string;
  index: string;
  className?: string;
}

export function ServiceVisualImage({
  src,
  alt,
  title,
  index,
  className = '',
}: ServiceVisualImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#080D25] via-[#05060D] to-[#0B173D] p-6 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[rgba(23,105,255,0.4)] bg-[#1769FF]/15 text-[#1769FF]">
          <Layers className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="mt-3 font-display text-xs font-semibold tracking-wider text-[#1769FF] tabular-nums">
          {index}
        </span>
        <span className="mt-1 font-display text-sm font-medium text-white">{title}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
