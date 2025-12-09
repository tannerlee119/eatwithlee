'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Pause, Play, X } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Main Image Display */}
      <div className="relative w-full rounded-xl overflow-hidden bg-slate-100 shadow-sm group">
        <div className="relative w-full flex items-center justify-center overflow-hidden aspect-[3/4]">
          {/* Image Container with Fade Animation */}
          {images.map((image, index) => (
            <button
              key={image.url}
              type="button"
              onClick={() => openModal(index)}
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 focus-visible:outline-none ${
                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-label={`Open image ${index + 1} of ${images.length} in fullscreen`}
            >
              <img
                src={image.url}
                alt={image.caption || `${restaurantName} - Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
            </button>
          ))}

          {/* Navigation Arrows (Glassmorphism) */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-20"
                aria-label="Previous image"
              >
                <ChevronLeft size={24} />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full border border-white/20 transition-all opacity-0 group-hover:opacity-100 z-20"
                aria-label="Next image"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Image Counter & Pause Button */}
          {images.length > 1 && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 z-20">
              <button
                onClick={togglePause}
                className="bg-black/40 hover:bg-black/60 backdrop-blur-md text-white p-2 rounded-full transition-all border border-white/10"
                aria-label={isPaused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
              </button>
              <div className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-xs font-bold tracking-wider border border-white/10">
                {currentIndex + 1} / {images.length}
              </div>
            </div>
          )}
        </div>

        {/* Caption Overlay */}
        {currentImage.caption && (
          <div className="absolute bottom-4 left-4 right-20 z-20 pointer-events-none">
            <p className="text-white text-sm font-medium drop-shadow-md line-clamp-2">
              {currentImage.caption}
            </p>
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="flex justify-center">
          <div className="flex gap-2 overflow-x-auto pb-2 pt-1 px-1 max-w-full no-scrollbar">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                  currentIndex === index
                    ? 'ring-2 ring-slate-900 ring-offset-2 opacity-100 scale-105'
                    : 'opacity-50 hover:opacity-100 grayscale hover:grayscale-0'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.caption || `Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {isMounted && isModalOpen && modalImage && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`${restaurantName} image viewer`}
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-6xl max-h-full flex flex-col items-center"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeModal}
              className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors p-2"
              aria-label="Close full screen image viewer"
            >
              <X size={32} />
            </button>

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={48} />
                </button>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    goToNext();
                  }}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={48} />
                </button>
              </>
            )}

            <img
              src={modalImage.url}
              alt={modalImage.caption || `${restaurantName} enlarged image`}
              className="max-h-[80vh] w-auto object-contain shadow-2xl rounded-sm"
              draggable={false}
            />

            {modalImage.caption && (
              <div className="mt-6 text-center">
                <p className="text-white/90 text-lg font-medium">{modalImage.caption}</p>
                <p className="text-white/50 text-sm mt-1 uppercase tracking-widest">
                  {modalIndex + 1} of {images.length}
                </p>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
