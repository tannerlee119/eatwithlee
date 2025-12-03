'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [wasPausedBeforeModal, setWasPausedBeforeModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const currentImage = images?.[currentIndex];
  const modalImage = images?.[modalIndex];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      if (isModalOpen) {
        setModalIndex(nextIndex);
      }
      return nextIndex;
    });
  }, [images.length, isModalOpen]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => {
      const nextIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      if (isModalOpen) {
        setModalIndex(nextIndex);
      }
      return nextIndex;
    });
  }, [images.length, isModalOpen]);

  const goToImage = useCallback((index: number) => {
    setCurrentIndex(index);
    if (isModalOpen) {
      setModalIndex(index);
    }
  }, [isModalOpen]);

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setWasPausedBeforeModal(isPaused);
    setIsPaused(true);
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setIsPaused(wasPausedBeforeModal);
  }, [wasPausedBeforeModal]);

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
  }, [currentIndex, isPaused, images.length, goToNext]);

  // Close modal on ESC / navigate with arrows
  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeModal();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        goToNext();
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        goToPrevious();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen, closeModal, goToNext, goToPrevious]);

  // Lock body scroll while modal is open
  useEffect(() => {
    if (!isModalOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen]);

  // Focus close button when modal opens
  useEffect(() => {
    if (isModalOpen && closeButtonRef.current) {
      closeButtonRef.current.focus();
    }
  }, [isModalOpen]);

  if (!images || images.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Main Image Display */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
        <div className="relative w-full flex items-center justify-center overflow-hidden aspect-[4/3] sm:aspect-[16/9]">
          {/* Image Container with Fade Animation */}
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => openModal(index)}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label={`Open image ${index + 1} of ${images.length} in fullscreen`}
            >
              <img
                src={image.url}
                alt={image.caption || `${restaurantName} - Image ${index + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </button>
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

      {isMounted && isModalOpen && modalImage && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${restaurantName} image viewer`}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl max-h-full"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              className="absolute -top-12 right-0 flex items-center justify-center rounded-full bg-black/70 text-white w-9 h-9 text-xl hover:bg-black/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Close full screen image viewer"
            >
              ×
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white p-3 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <div className="flex items-center justify-center">
              <img
                src={modalImage.url}
                alt={modalImage.caption || `${restaurantName} enlarged image`}
                className="max-h-[85vh] w-auto object-contain rounded-xl shadow-2xl"
                draggable={false}
              />
            </div>

            {modalImage.caption && (
              <div className="mt-4 text-center text-sm text-gray-200">
                {modalImage.caption}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
