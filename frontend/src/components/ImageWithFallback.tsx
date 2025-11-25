// src/components/ImageWithFallback.tsx
import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallback?: React.ReactNode;
  onError?: () => void;
}

export default function ImageWithFallback({ 
  src, 
  alt, 
  className = "", 
  fallback,
  onError 
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  const handleError = () => {
    setError(true);
    onError?.();
  };

  if (error || !src) {
    return fallback || (
      <div className={`bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center ${className}`}>
        <div className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center">
          <span className="text-2xl">💊</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
}