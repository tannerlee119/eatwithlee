'use client';

import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { ImageWithCaption } from '@/lib/types';

interface ImageCarouselProps {
  images: ImageWithCaption[];
  restaurantName: string;
}

export default function ImageCarousel({ images, restaurantName }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const currentImage = images?.[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentIndex(index);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  // Auto-rotation effect
  useEffect(() => {
    // Only auto-rotate if there's more than one image and not paused
    if (images.length <= 1 || isPaused) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      goToNext();
    }, 5000); // 5 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentIndex, isPaused, images.length]);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-black">
        <div className="relative w-full flex items-center justify-center overflow-hidden aspect-[4/3] sm:aspect-[16/9]">
          {/* Image Container with Fade Animation */}
          {images.map((image, index) => (
            <img
              key={image.url}
              src={image.url}
              alt={image.caption || `${restaurantName} - Image ${index + 1}`}
              className={`absolute max-h-full max-w-full object-contain transition-opacity duration-700 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-sm border border-gray-200 transition-all z-10"
                aria-label="Previous image"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-sm border border-gray-200 transition-all z-10"
                aria-label="Next image"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Image Counter & Pause Button */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
              <button
                onClick={togglePause}
                className="bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all"
                aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {isPaused ? <Play size={16} /> : <Pause size={16} />}
              </button>
              <div className="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-medium">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </div>

        {/* Caption */}
        {currentImage.caption && (
          <div
            key={currentIndex}
            className="px-5 py-4 bg-white animate-fadeIn border-t border-gray-100"
          >
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-500 mb-1">
              Photo {currentIndex + 1} of {images.length}
            </p>
            <p className="text-sm text-gray-800">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1 pt-1 px-1">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => goToImage(index)}
              className={`flex-shrink-0 rounded-lg overflow-hidden border transition-all ${
                currentIndex === index
                  ? 'border-secondary shadow-sm opacity-100'
                  : 'border-transparent opacity-60 hover:opacity-90'
              }`}
            >
              <img
                src={image.url}
                alt={image.caption || `Thumbnail ${index + 1}`}
                className="w-20 h-20 object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
