'use client';

import { Review } from '@/lib/types';
import { MapPin, Star, Clock, ArrowLeft, ListOrdered, Globe, Instagram } from 'lucide-react';
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
        <div className="flex items-center gap-4 mb-4 flex-wrap">
          <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-semibold transform hover:scale-110 transition-transform duration-300">
            <Star size={18} fill="currentColor" />
            <span className="text-lg">{review.rating}/10</span>
          </div>
          {review.contentType === 'list' && (
            <div className="flex items-center gap-2 bg-secondary text-gray-900 px-4 py-2 rounded-full font-bold">
              <ListOrdered size={18} />
              <span>LIST</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <span>{formatDate(review.publishedAt)}</span>
          </div>
        </div>

        <h1 className="text-5xl font-display font-bold mb-4 text-gray-900 hover:text-primary transition-colors duration-300">
          {review.restaurantName}
        </h1>

        <div className="flex items-start gap-2 text-gray-700 mb-6">
          <MapPin size={20} className="mt-1 flex-shrink-0" />
          <span className="text-lg">{review.location.address}</span>
        </div>

        <p className="text-xl text-gray-700 leading-relaxed">
          {review.excerpt}
        </p>
      </header>

      {/* Image Carousel */}
      <div
        className="mb-12"
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.2s both'
        }}
      >
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
          <h3 className="font-display font-semibold text-lg mb-3 text-gray-900">Cuisines</h3>
          <div className="flex flex-wrap gap-2">
            {review.tags.cuisines.map((cuisine, idx) => (
              <span
                key={cuisine}
                className="px-3 py-1 bg-primary/10 text-orange-700 rounded-full text-sm font-semibold hover:bg-primary/30 transition-all duration-300 cursor-default"
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
          <h3 className="font-display font-semibold text-lg mb-3 text-gray-900">Vibes</h3>
          <div className="flex flex-wrap gap-2">
            {review.tags.vibes.map((vibe, idx) => (
              <span
                key={vibe}
                className="px-3 py-1 bg-secondary/30 text-gray-800 rounded-full text-sm font-medium hover:bg-secondary/80 hover:text-gray-900 hover:font-semibold transition-all duration-300 cursor-default"
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
          <h3 className="font-display font-semibold text-lg mb-3 text-gray-900">Food Types</h3>
          <div className="flex flex-wrap gap-2">
            {review.tags.foodTypes.map((type, idx) => (
              <span
                key={type}
                className="px-3 py-1 bg-accent text-gray-800 rounded-full text-sm font-medium hover:bg-accent/90 hover:text-gray-900 hover:font-semibold transition-all duration-300 cursor-default"
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

      {/* Favorite Dishes */}
      {review.favoriteDishes.length > 0 && (
        <div
          className="mb-12 p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-primary/30 transition-all duration-300"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.4s both'
          }}
        >
          <h3 className="font-display font-semibold text-xl mb-4 text-gray-900">
            Must-Try Dishes
          </h3>
          <ul className="space-y-2">
            {review.favoriteDishes.map((dish, index) => (
              <li
                key={index}
                className="flex items-center gap-3 hover:translate-x-2 transition-transform duration-300"
                style={{
                  animation: `fadeIn 0.4s ease-out ${0.5 + index * 0.1}s both`
                }}
              >
                <span className="text-primary text-xl">•</span>
                <span className="text-gray-800 text-lg">{dish}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Review Content */}
      <div
        className="prose prose-lg max-w-none mb-12"
        style={{
          animation: 'fadeInUp 0.6s ease-out 0.5s both'
        }}
      >
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {review.content}
        </p>
      </div>

      {/* Social Links */}
      {(review.website || review.instagram) && (
        <div
          className="mb-12 flex items-center gap-4"
          style={{
            animation: 'fadeInUp 0.6s ease-out 0.55s both'
          }}
        >
          {review.website && (
            <a
              href={review.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Globe size={20} className="text-gray-900" />
              <span className="text-gray-900 font-medium">Website</span>
            </a>
          )}
          {review.instagram && (
            <a
              href={review.instagram.startsWith('http') ? review.instagram : `https://instagram.com/${review.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-300 hover:scale-105"
            >
              <Instagram size={20} className="text-gray-900" />
              <span className="text-gray-900 font-medium">Instagram</span>
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
