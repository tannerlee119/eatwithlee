import { getAllReviews } from '@/lib/db-reviews';
import ReviewCard from '@/components/ReviewCard';

export const revalidate = 0; // Disable caching to always show latest reviews

export default async function Home() {
  const allReviews = await getAllReviews();

  // Filter to only show published reviews (not drafts)
  const reviews = allReviews.filter(review => !review.isDraft);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight mb-6">
          EAT WITH LEE
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          A curated collection of the best food experiences, honest reviews, and hidden gems.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Pagination placeholder */}
        {reviews.length > 9 && (
          <div className="mt-16 flex justify-center">
            <div className="text-slate-400 text-sm font-medium tracking-wide uppercase">More reviews coming soon</div>
          </div>
        )}
      </div>
    </div>
  );
}
