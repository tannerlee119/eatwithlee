import { getAllReviews } from '@/lib/db-reviews';
import ReviewCard from '@/components/ReviewCard';

export const revalidate = 0;

export default async function CafesPage() {
  const allReviews = await getAllReviews();
  const reviews = allReviews.filter(
    (r) => !r.isDraft && r.contentType === 'review' && r.venueType === 'cafe'
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Cafes
          </h1>
          <p className="mt-2 text-slate-600">Coffee, pastries, and cozy hangs.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}


