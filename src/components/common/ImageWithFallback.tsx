import React, { useState } from 'react';
import { Armchair } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
  className?: string;
  aspectRatio?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Interwood Lahore Furniture',
  fallbackText,
  className = '',
  aspectRatio,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`relative flex flex-col items-center justify-center bg-[#EDE8DF] text-[#8B6F47] overflow-hidden p-6 select-none ${className}`}
        style={aspectRatio ? { aspectRatio } : undefined}
      >
        <div className="w-12 h-12 rounded-full bg-[#F7F5F1] flex items-center justify-center mb-2 shadow-xs border border-[#8B6F47]/20">
          <Armchair className="w-6 h-6 text-[#8B6F47]" strokeWidth={1.5} />
        </div>
        <span className="text-xs font-semibold tracking-wider uppercase text-[#171717]/80 text-center line-clamp-1">
          {fallbackText || alt}
        </span>
        <span className="text-[10px] text-[#8B6F47] mt-0.5 tracking-wide">
          Interwood Lahore
        </span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`} style={aspectRatio ? { aspectRatio } : undefined}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#EDE8DF] animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        {...props}
      />
    </div>
  );
};
