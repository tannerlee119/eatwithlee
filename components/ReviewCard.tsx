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
      <article className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-gray-300">
        {/* Image */}
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
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
                  e.currentTarget.style.width = `${review.coverImageCrop!.zoom * 110}%`;
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
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-60" />
          {/* Content Type Badge */}
          {review.contentType === 'list' && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-secondary text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              <ListOrdered size={14} />
              <span>LIST</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title & Restaurant */}
          <h2 className="text-2xl font-display font-semibold mb-3 text-gray-900 group-hover:text-gray-950 transition-colors line-clamp-2">
            {review.restaurantName}
          </h2>

          {/* Rating, Price, Date */}
          <div className="flex items-center gap-3 mb-3 text-sm text-gray-700">
            <div className="flex items-center gap-1.5">
              <Star size={13} className="text-gray-400" />
              <span className="font-medium">{review.rating}/10</span>
            </div>
            <span className="font-medium">{'$'.repeat(review.priceRange)}</span>
            <span className="text-xs text-gray-400">
              {formatDate(review.publishedAt)}
            </span>
          </div>

          {/* Location */}
          {review.locationTag && (
            <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
              <MapPin size={14} />
              <span className="line-clamp-1">{review.locationTag}</span>
            </div>
          )}

          {/* Excerpt */}
          <p className="text-gray-700 mb-4 line-clamp-3">
            {review.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {/* Show cuisines first */}
            {review.tags.cuisines.slice(0, 2).map((cuisine, idx) => (
              <span
                key={cuisine}
                className="text-[11px] px-3 py-1 rounded-full font-medium bg-accent text-gray-800 border border-gray-200"
                style={{
                  transform: isHovered ? 'translateY(0)' : 'translateY(3px)',
                  opacity: isHovered ? 1 : 0.9,
                  transition: `all 0.25s ease ${idx * 0.04}s`
                }}
              >
                {cuisine}
              </span>
            ))}
            {/* Show all vibes */}
            {review.tags.vibes.map((vibe, idx) => (
              <span
                key={vibe}
                className="text-[11px] px-3 py-1 rounded-full font-medium bg-white text-gray-700 border border-gray-200"
                style={{
                  transform: isHovered ? 'translateY(0)' : 'translateY(3px)',
                  opacity: isHovered ? 1 : 0.9,
                  transition: `all 0.25s ease ${(review.tags.cuisines.slice(0, 2).length + idx) * 0.04}s`
                }}
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>
      </article>
    </Link>
  );
}
