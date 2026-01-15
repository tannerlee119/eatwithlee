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
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-12 transition-all duration-300 hover:-translate-x-1 group"
        style={{ animation: 'fadeIn 0.5s ease-out' }}
      >
        <ArrowLeft size={18} className="transition-transform group-hover:-translate-x-1" />
        <span className="font-medium tracking-wide text-sm uppercase">Back to Reviews</span>
      </Link>

      {/* Header */}
      <header
        className="mb-12 text-center max-w-2xl mx-auto"
        style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
      >
        <h1 className="text-5xl md:text-7xl font-display font-bold mb-8 text-slate-900 tracking-tight leading-none">
          {review.restaurantName}
        </h1>

        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3 mb-6 text-sm font-medium tracking-wider sm:tracking-widest text-slate-500 uppercase">
          <span>{review.locationTag || 'Seattle, WA'}</span>
          <span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
          <span>{formatDate(review.publishedAt)}</span>
        </div>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 text-slate-700 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm">
            <span>{'$'.repeat(review.priceRange)}</span>
          </div>
          {review.contentType === 'list' && (
            <div className="flex items-center gap-1.5 bg-slate-100 text-slate-900 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider">
              <ListOrdered size={14} />
              <span>List</span>
            </div>
          )}
        </div>

        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light">
          {review.excerpt}
        </p>
      </header>

      {/* Image Carousel */}
      <div
        className="mb-16 rounded-2xl overflow-hidden shadow-2xl max-w-lg mx-auto"
        style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
      >
        <ImageCarousel images={review.images} restaurantName={review.restaurantName} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div
            className="prose prose-lg prose-slate max-w-none mb-16 first-letter:text-5xl first-letter:font-display first-letter:font-bold first-letter:mr-3 first-letter:float-left"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.4s both' }}
          >
            <p className="whitespace-pre-wrap leading-relaxed text-slate-700">
              {review.content}
            </p>
          </div>

          {/* Dishes Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {review.favoriteDishes.length > 0 && (
              <div
                className="p-8 bg-slate-50 rounded-2xl border border-slate-100"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.5s both' }}
              >
                <h3 className="font-display font-bold text-xl mb-6 text-slate-900 tracking-wide uppercase flex items-center gap-2">
                  <span className="text-green-500">●</span> Highlights
                </h3>
                <ul className="space-y-3">
                  {review.favoriteDishes.map((dish, index) => (
                    <li key={index} className="text-slate-700 font-medium flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      {dish}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {review.leastFavoriteDishes && review.leastFavoriteDishes.length > 0 && (
              <div
                className="p-8 bg-white rounded-2xl border border-slate-200"
                style={{ animation: 'fadeInUp 0.6s ease-out 0.55s both' }}
              >
                <h3 className="font-display font-bold text-xl mb-6 text-slate-900 tracking-wide uppercase flex items-center gap-2">
                  <span className="text-red-500">●</span> Misses
                </h3>
                <ul className="space-y-3">
                  {review.leastFavoriteDishes.map((dish, index) => (
                    <li key={index} className="text-slate-600 flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 flex-shrink-0" />
                      {dish}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-10">
          {/* Location */}
          {/* Location Card */}
          <div style={{ animation: 'fadeInUp 0.6s ease-out 0.6s both' }}>
            <h3 className="font-display font-bold text-lg mb-4 text-slate-900 uppercase tracking-wider">Destination</h3>
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 group hover:shadow-xl transition-shadow duration-300">
              {/* Map Container */}
              <div className="h-64 w-full relative z-0">
                <RestaurantMap
                  lat={review.location.lat}
                  lng={review.location.lng}
                  name={review.restaurantName}
                  address={review.location.address}
                />
              </div>
              
              {/* Address & Action */}
              <div className="p-6 relative z-20 bg-white">
                <div className="flex items-start gap-3 mb-6">
                  <div className="bg-slate-50 p-2.5 rounded-full text-slate-900">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{review.restaurantName}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{review.location.address}</p>
                  </div>
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${review.restaurantName} ${review.location.address}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-slate-900 hover:bg-slate-800 text-white text-center py-3 rounded-xl font-bold text-sm transition-colors shadow-md hover:shadow-lg"
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ animation: 'fadeInUp 0.6s ease-out 0.7s both' }}>
            <h3 className="font-display font-bold text-lg mb-4 text-slate-900 uppercase tracking-wider">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {review.tags.cuisines.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 text-white">
                  {tag}
                </span>
              ))}
              {review.tags.vibes.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {tag}
                </span>
              ))}
              {review.tags.foodTypes.map((tag) => (
                <span key={tag} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-slate-600 border border-slate-200">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Social Links */}
          {(review.website || review.instagram || review.yelp) && (
            <div style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}>
              <h3 className="font-display font-bold text-lg mb-4 text-slate-900 uppercase tracking-wider">Connect</h3>
              <div className="flex flex-col gap-3">
                {review.website && (
                  <a
                    href={review.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-900 hover:shadow-md transition-all group"
                  >
                    <Globe size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Website</span>
                  </a>
                )}
                {review.instagram && (
                  <a
                    href={review.instagram.startsWith('http') ? review.instagram : `https://instagram.com/${review.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-900 hover:shadow-md transition-all group"
                  >
                    <Instagram size={18} className="text-slate-400 group-hover:text-slate-900 transition-colors" />
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Instagram</span>
                  </a>
                )}
                {review.yelp && (
                  <a
                    href={review.yelp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl hover:border-slate-900 hover:shadow-md transition-all group"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-slate-400 group-hover:text-slate-900 transition-colors">
                      <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 0 1 1.596-.206 9.194 9.194 0 0 1 2.364 3.252 1.073 1.073 0 0 1-.686 1.459zm-5.025 3.152l4.942 1.606a1.072 1.072 0 0 1 .636 1.48 9.316 9.316 0 0 1-2.47 3.169 1.073 1.073 0 0 1-1.592-.26l-2.76-4.409c-.528-.847.288-1.894 1.236-1.584zm-4.796-4.368L5.454 2.916a1.072 1.072 0 0 1 .466-1.5A14.973 14.973 0 0 1 11.184.003a1.07 1.07 0 0 1 1.153 1.068v9.768c0 1.096-1.45 1.483-1.998.535zm-.857 4.17L4.44 16.806a1.073 1.073 0 0 1-1.324-.92 9.218 9.218 0 0 1 .43-3.997 1.07 1.07 0 0 1 1.485-.62l4.668 2.279c.9.438.763 1.76-.207 2.000zm.886 1.477c.669-.744 1.901-.246 1.866.752l-.19 5.188a1.073 1.073 0 0 1-1.247 1.02 9.314 9.314 0 0 1-3.722-1.502 1.072 1.072 0 0 1-.187-1.6l3.477-3.864z"/>
                    </svg>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">Yelp</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Score Reveal */}
      <div
        className="mt-12 pt-8 border-t border-slate-100 text-center"
        style={{ animation: 'fadeIn 0.6s ease-out 0.85s both' }}
      >
        <div className="inline-flex items-center gap-2 text-slate-600">
          <span className="text-sm font-medium uppercase tracking-widest">The Verdict</span>
          <span className="text-slate-300">—</span>
          <span className="flex items-center gap-1.5 text-slate-900 font-bold">
            <Star size={14} fill="currentColor" />
            {review.rating}/10
          </span>
        </div>
      </div>

      {/* Author Footer */}
      <div
        className="mt-12 pt-8 border-t border-slate-100 text-center"
        style={{ animation: 'fadeIn 0.6s ease-out 0.9s both' }}
      >
        <p className="text-slate-400 text-sm font-medium uppercase tracking-widest">
          Review by {review.author}
        </p>
      </div>
    </article>
  );
}
