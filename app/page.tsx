import { getAllReviews } from '@/lib/db-reviews';
import ReviewCard from '@/components/ReviewCard';

export default async function Home() {
  const reviews = await getAllReviews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-display font-bold mb-4 text-gray-900">
          Eat with Lee
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Exploring the finest culinary experiences, one dish at a time
        </p>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination placeholder */}
      {reviews.length > 9 && (
        <div className="mt-12 flex justify-center">
          <div className="text-gray-500">More reviews coming soon...</div>
        </div>
      )}
    </div>
  );
}
