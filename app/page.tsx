import { getAllReviews } from '@/lib/db-reviews';
import ReviewCard from '@/components/ReviewCard';

export const revalidate = 0; // Disable caching to always show latest reviews

export default async function Home() {
  const reviews = await getAllReviews();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
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
