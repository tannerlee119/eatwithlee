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
      <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-primary/20 transform hover:-translate-y-2">
        {/* Image */}
        <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
          <img
            src={review.coverImage}
            alt={review.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/30 to-transparent transition-opacity duration-500 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
          {/* Content Type Badge */}
          {review.contentType === 'list' && (
            <div className="absolute top-4 left-4 flex items-center gap-1 bg-secondary text-gray-900 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
              <ListOrdered size={14} />
              <span>LIST</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Rating and Price */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold transform group-hover:scale-110 transition-transform duration-300">
              <Star size={14} fill="currentColor" className="animate-pulse" />
              <span>{review.rating}</span>
            </div>
            <div className="bg-gray-800 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {'$'.repeat(review.priceRange)}
            </div>
            <span className="text-gray-500 text-sm">{formatDate(review.publishedAt)}</span>
          </div>

          {/* Title & Restaurant */}
          <h2 className="text-2xl font-display font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {review.restaurantName}
          </h2>

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
                className="text-xs px-3 py-1 bg-primary/10 text-orange-700 rounded-full font-semibold hover:bg-primary/30 transition-all duration-300"
                style={{
                  transform: isHovered ? 'translateY(0)' : 'translateY(5px)',
                  opacity: isHovered ? 1 : 0.8,
                  transition: `all 0.3s ease ${idx * 0.05}s`
                }}
              >
                {cuisine}
              </span>
            ))}
            {/* Show all vibes */}
            {review.tags.vibes.map((vibe, idx) => (
              <span
                key={vibe}
                className="text-xs px-3 py-1 bg-secondary/40 text-gray-800 rounded-full font-semibold hover:bg-secondary/80 hover:text-gray-900 transition-all duration-300"
                style={{
                  transform: isHovered ? 'translateY(0)' : 'translateY(5px)',
                  opacity: isHovered ? 1 : 0.8,
                  transition: `all 0.3s ease ${(review.tags.cuisines.slice(0, 2).length + idx) * 0.05}s`
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
