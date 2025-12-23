import Link from 'next/link';
import { getAllReviews } from '@/lib/db-reviews';

export const revalidate = 0;

export default async function LovedListPage() {
  const allReviews = await getAllReviews();

  const loved = allReviews
    .filter((r) => !r.isDraft && r.rating >= 8)
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Loved List
          </h1>
          <p className="mt-2 text-slate-600">
            Restaurants rated <span className="font-semibold">8/10</span> and above.
          </p>
        </div>

        {loved.length === 0 ? (
          <p className="text-slate-600">No loved reviews yet.</p>
        ) : (
          <ol className="space-y-4">
            {loved.map((review, idx) => (
              <li
                key={review.id}
                className="flex items-baseline justify-between gap-6 border-b border-slate-100 pb-4"
              >
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wide text-slate-400 font-medium">
                    #{idx + 1}
                  </div>
                  <Link
                    href={`/reviews/${review.slug}`}
                    className="text-lg font-semibold text-slate-900 hover:text-slate-700 transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-slate-400"
                  >
                    {review.restaurantName}
                  </Link>
                  <div className="mt-1 text-sm text-slate-500">
                    {review.locationTag || 'Seattle, WA'} • {'$'.repeat(review.priceRange)}
                  </div>
                </div>

                <div className="shrink-0 text-sm font-bold text-slate-900">
                  {review.rating}/10
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}


