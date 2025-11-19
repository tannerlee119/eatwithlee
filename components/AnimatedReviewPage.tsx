'use client';

import { Review } from '@/lib/types';
import { MapPin, Star, Clock, ArrowLeft, ListOrdered, Globe, Instagram, MessageCircle } from 'lucide-react';
import RestaurantMap from '@/components/RestaurantMap';
import ImageCarousel from '@/components/ImageCarousel';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AnimatedReviewPageProps {
  review: Review;
}

export default function AnimatedReviewPage({ review }: AnimatedReviewPageProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-all duration-300 hover:gap-3"
        style={{
          animation: 'fadeIn 0.5s ease-out'
        }}
      >
        <ArrowLeft size={20} />
        <span>Back to Reviews</span>
      </Link>

      {/* Header */}
      <header
        className="mb-8"
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.1s both'
        }}
      >
        <h1 className="text-4xl md:text-5xl font-display font-semibold mb-4 text-gray-900 tracking-tight">
          {review.restaurantName}
        </h1>

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-semibold text-gray-900">
            <Star size={16} fill="currentColor" className="text-yellow-500" />
            <span>{review.rating}/10</span>
          </div>
          <div className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-800">
            {'$'.repeat(review.priceRange)}
          </div>
          {review.contentType === 'list' && (
            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-700">
              <ListOrdered size={16} />
              <span>List</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <span>{formatDate(review.publishedAt)}</span>
          </div>
        </div>

        <p className="text-xl text-gray-700 leading-relaxed mb-6">
          {review.excerpt}
        </p>

        <div className="flex items-start gap-2 text-gray-700">
          <MapPin size={20} className="mt-1 flex-shrink-0" />
          <span className="text-lg">{review.location.address}</span>
        </div>
      </header>

      {/* Image Carousel */}
      <div
        className="mb-12"
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.2s both'
        }}
      >
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xs font-semibold tracking-[0.2em] text-gray-500 uppercase">
            Photos
          </h2>
          <span className="text-xs text-gray-400">
            {review.images.length} {review.images.length === 1 ? 'image' : 'images'}
          </span>
        </div>
        <ImageCarousel images={review.images} restaurantName={review.restaurantName} />
      </div>

      {/* Tags Section */}
      <div
        className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.3s both'
        }}
      >
        {/* Cuisines */}
        <div>
          <h3 className="font-display font-semibold text-base mb-3 text-gray-900 tracking-wide uppercase">
            Cuisines
          </h3>
          <div className="flex flex-wrap gap-2">
            {review.tags.cuisines.map((cuisine, idx) => (
              <span
                key={cuisine}
                className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-gray-800 border border-gray-200"
                style={{
                  animation: `fadeIn 0.4s ease-out ${0.4 + idx * 0.1}s both`
                }}
              >
                {cuisine}
              </span>
            ))}
          </div>
        </div>

        {/* Vibes */}
        <div>
          <h3 className="font-display font-semibold text-base mb-3 text-gray-900 tracking-wide uppercase">
            Vibes
          </h3>
          <div className="flex flex-wrap gap-2">
            {review.tags.vibes.map((vibe, idx) => (
              <span
                key={vibe}
                className="px-3 py-1 rounded-full text-xs font-medium bg-white text-gray-700 border border-gray-200 cursor-default"
                style={{
                  animation: `fadeIn 0.4s ease-out ${0.4 + idx * 0.1}s both`
                }}
              >
                {vibe}
              </span>
            ))}
          </div>
        </div>

        {/* Food Types */}
        <div>
          <h3 className="font-display font-semibold text-base mb-3 text-gray-900 tracking-wide uppercase">
            Food Types
          </h3>
          <div className="flex flex-wrap gap-2">
            {review.tags.foodTypes.map((type, idx) => (
              <span
                key={type}
                className="px-3 py-1 rounded-full text-xs font-medium bg-accent text-gray-800 border border-gray-200 cursor-default"
                style={{
                  animation: `fadeIn 0.4s ease-out ${0.4 + idx * 0.1}s both`
                }}
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Review Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.4s both'
        }}
      >
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {review.content}
        </p>
      </div>

      {/* Favorite Dishes */}
      {review.favoriteDishes.length > 0 && (
        <div
          className="mb-12 p-6 bg-accent rounded-xl border border-gray-200"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.5s both'
          }}
        >
          <h3 className="font-display font-semibold text-lg mb-3 text-gray-900 tracking-wide uppercase">
            Favorite Dishes
          </h3>
          <ul className="space-y-2">
            {review.favoriteDishes.map((dish, index) => (
              <li
                key={index}
                className="flex items-center gap-3"
                style={{
                  animation: `fadeIn 0.4s ease-out ${0.55 + index * 0.1}s both`
                }}
              >
                <span className="flex h-2 w-2 rounded-full bg-green-500" />
                <span className="text-gray-800 text-base">{dish}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Least Favorite Dishes */}
      {review.leastFavoriteDishes && review.leastFavoriteDishes.length > 0 && (
        <div
          className="mb-12 p-6 bg-accent rounded-xl border border-gray-200"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.55s both'
          }}
        >
          <h3 className="font-display font-semibold text-lg mb-3 text-gray-900 tracking-wide uppercase">
            Least Favorite Dishes
          </h3>
          <ul className="space-y-2">
            {review.leastFavoriteDishes.map((dish, index) => (
              <li
                key={index}
                className="flex items-center gap-3"
                style={{
                  animation: `fadeIn 0.4s ease-out ${0.6 + index * 0.1}s both`
                }}
              >
                <span className="flex h-2 w-2 rounded-full bg-red-500" />
                <span className="text-gray-800 text-base">{dish}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Social Links */}
      {(review.website || review.instagram || review.yelp) && (
        <div
          className="mb-12 flex items-center gap-3"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.55s both'
          }}
        >
          {review.website && (
            <a
              href={review.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
            >
              <Globe size={16} className="text-gray-900" />
              <span className="text-gray-900 font-medium">Website</span>
            </a>
          )}
          {review.instagram && (
            <a
              href={review.instagram.startsWith('http') ? review.instagram : `https://instagram.com/${review.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
            >
              <Instagram size={16} className="text-gray-900" />
              <span className="text-gray-900 font-medium">Instagram</span>
            </a>
          )}
          {review.yelp && (
            <a
              href={review.yelp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105 text-sm"
            >
              <MessageCircle size={16} className="text-gray-900" />
              <span className="text-gray-900 font-medium">Yelp</span>
            </a>
          )}
        </div>
      )}

      {/* Map */}
      <div
        className="mb-12"
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.6s both'
        }}
      >
        <h3 className="font-display font-semibold text-2xl mb-6 text-gray-900">Location</h3>
        <RestaurantMap
          lat={review.location.lat}
          lng={review.location.lng}
          name={review.restaurantName}
          address={review.location.address}
        />
      </div>

      {/* Author */}
      <div
        className="border-t border-gray-200 pt-8"
        style={{
          animation: 'fadeIn 0.6s ease-out 0.7s both'
        }}
      >
        <p className="text-gray-600">
          Review by <span className="font-semibold text-gray-900">{review.author}</span>
        </p>
      </div>
    </article>
  );
}
