import Link from 'next/link';
import { Review } from '@/lib/types';
import { MapPin, Star } from 'lucide-react';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/reviews/${review.slug}`} className="group">
      <article className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100">
        {/* Image */}
        <div className="aspect-[4/3] bg-gray-200 overflow-hidden">
          <img
            src={review.coverImage}
            alt={review.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">
              <Star size={14} fill="currentColor" />
              <span>{review.rating}</span>
            </div>
            <span className="text-gray-500 text-sm">{formatDate(review.publishedAt)}</span>
          </div>

          {/* Title & Restaurant */}
          <h2 className="text-2xl font-display font-bold mb-2 text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
            {review.restaurantName}
          </h2>

          {/* Location */}
          <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
            <MapPin size={14} />
            <span className="line-clamp-1">{review.location.address}</span>
          </div>

          {/* Excerpt */}
          <p className="text-gray-700 mb-4 line-clamp-3">
            {review.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {review.tags.cuisines.slice(0, 3).map((cuisine) => (
              <span
                key={cuisine}
                className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full"
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
