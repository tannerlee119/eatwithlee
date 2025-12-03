'use client';

import Link from 'next/link';
import { Review } from '@/lib/types';
import { MapPin, Star, ListOrdered } from 'lucide-react';
import { useState } from 'react';

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link
      href={`/reviews/${review.slug}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
      }}
    >
      <article className="bg-white rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
        {/* Image */}
        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
          {review.coverImageCrop ? (
            <div className="w-full h-full relative overflow-hidden">
              <img
                src={review.coverImage}
                alt={review.title}
                className="absolute transition-all duration-700 ease-out"
                style={{
                  width: `${review.coverImageCrop.zoom * 100}%`,
                  height: 'auto',
                  left: '50%',
                  top: '50%',
                  transform: `translate(-${review.coverImageCrop.x}%, -${review.coverImageCrop.y}%)`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.width = `${review.coverImageCrop!.zoom * 105}%`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.width = `${review.coverImageCrop!.zoom * 100}%`;
                }}
              />
            </div>
          ) : (
            <img
              src={review.coverImage}
              alt={review.title}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          
          {/* Content Type Badge */}
          {review.contentType === 'list' && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-sm uppercase">
              <ListOrdered size={12} />
              <span>LIST</span>
            </div>
          )}

          {/* Rating Badge (Overlay) */}
          <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-slate-900 px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm">
            <Star size={12} fill="currentColor" className="text-slate-900" />
            {review.rating}
          </div>
        </div>

        {/* Content */}
        <div className="pt-5 pb-2">
          {/* Meta */}
          <div className="flex items-center gap-3 mb-2 text-xs font-medium text-slate-500 uppercase tracking-wide">
            <span>{review.locationTag || 'Seattle, WA'}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span>{'$'.repeat(review.priceRange)}</span>
          </div>

          {/* Title */}
          <h2 className="text-xl font-display font-bold mb-2 text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
            {review.restaurantName}
          </h2>

          {/* Excerpt */}
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-2 mb-4">
            {review.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {review.tags.cuisines.slice(0, 3).map((cuisine) => (
              <span
                key={cuisine}
                className="text-[10px] px-2.5 py-1 rounded-md font-medium bg-slate-50 text-slate-600 border border-slate-100"
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
