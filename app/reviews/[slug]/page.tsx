import { getReviewBySlug, getAllReviews } from '@/lib/db-reviews';
import { notFound } from 'next/navigation';
import { MapPin, Star, Clock, Edit } from 'lucide-react';
import RestaurantMap from '@/components/RestaurantMap';
import ImageCarousel from '@/components/ImageCarousel';
import Link from 'next/link';

export async function generateStaticParams() {
  const reviews = await getAllReviews();
  return reviews.map((review) => ({
    slug: review.slug,
  }));
}

export default async function ReviewPage({ params }: { params: { slug: string } }) {
  const review = await getReviewBySlug(params.slug);

  if (!review) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full font-semibold">
              <Star size={18} fill="currentColor" />
              <span className="text-lg">{review.rating}/10</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={16} />
              <span>{formatDate(review.publishedAt)}</span>
            </div>
          </div>
          <Link
            href={`/admin?edit=${review.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Edit size={16} />
            Edit
          </Link>
        </div>

        <h1 className="text-5xl font-display font-bold mb-4 text-gray-900">
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
      <div className="mb-12">
        <ImageCarousel images={review.images} restaurantName={review.restaurantName} />
      </div>

      {/* Tags Section */}
      <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Cuisines */}
        <div>
          <h3 className="font-display font-semibold text-lg mb-3 text-gray-900">Cuisines</h3>
          <div className="flex flex-wrap gap-2">
            {review.tags.cuisines.map((cuisine) => (
              <span
                key={cuisine}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
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
            {review.tags.vibes.map((vibe) => (
              <span
                key={vibe}
                className="px-3 py-1 bg-secondary/30 text-gray-800 rounded-full text-sm font-medium"
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
            {review.tags.foodTypes.map((type) => (
              <span
                key={type}
                className="px-3 py-1 bg-accent text-gray-800 rounded-full text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Favorite Dishes */}
      {review.favoriteDishes.length > 0 && (
        <div className="mb-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-display font-semibold text-xl mb-4 text-gray-900">
            Must-Try Dishes
          </h3>
          <ul className="space-y-2">
            {review.favoriteDishes.map((dish, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="text-primary text-xl">•</span>
                <span className="text-gray-800 text-lg">{dish}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Review Content */}
      <div className="prose prose-lg max-w-none mb-12">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {review.content}
        </p>
      </div>

      {/* Map */}
      <div className="mb-12">
        <h3 className="font-display font-semibold text-2xl mb-6 text-gray-900">Location</h3>
        <RestaurantMap
          lat={review.location.lat}
          lng={review.location.lng}
          name={review.restaurantName}
          address={review.location.address}
        />
      </div>

      {/* Author */}
      <div className="border-t border-gray-200 pt-8">
        <p className="text-gray-600">
          Review by <span className="font-semibold text-gray-900">Tanner Lee</span>
        </p>
      </div>
    </article>
  );
}
