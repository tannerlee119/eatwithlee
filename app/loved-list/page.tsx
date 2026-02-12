import Link from 'next/link';
import { getAllReviews } from '@/lib/db-reviews';

export const revalidate = 0;

export default async function LovedListPage() {
  const allReviews = await getAllReviews();

  const currentYear = new Date().getFullYear();

  const loved = allReviews
    .filter((r) => !r.isDraft && r.rating >= 8 && new Date(r.publishedAt).getFullYear() === currentYear)
    .sort((a, b) => b.rating - a.rating);

  const getFeaturedTag = (review: any) =>
    review.featuredTag || review.tags?.cuisines?.[0] || review.tags?.foodTypes?.[0] || '';

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Loved List
          </h1>
          <p className="mt-2 text-slate-600">
            Restaurants rated <span className="font-semibold">8/10</span> and above in {currentYear}.
          </p>
        </div>

        {loved.length === 0 ? (
          <p className="text-slate-600">No loved reviews yet.</p>
        ) : (
          <ol className="space-y-6">
            {loved.map((review, idx) => (
              <li key={review.id} className="border-b border-slate-100 pb-6">
                <Link href={`/reviews/${review.slug}`} className="group block">
                  <div className="flex gap-4">
                    <div className="relative w-28 h-20 sm:w-36 sm:h-24 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                      <img
                        src={review.coverImage}
                        alt={review.restaurantName}
                        loading={idx < 3 ? 'eager' : 'lazy'}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="min-w-0">
                          <div className="text-xs uppercase tracking-wide text-slate-400 font-medium">
                            #{idx + 1}
                          </div>
                          <div className="text-xl font-semibold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
                            {review.restaurantName}
                          </div>
                        </div>

                        <div className="shrink-0 text-sm font-bold text-slate-900">
                          {review.rating}/10
                        </div>
                      </div>

                      <div className="mt-1 text-sm text-slate-700">
                        {review.locationTag || 'Seattle, WA'}
                      </div>

                      <div className="mt-1 text-sm text-slate-700">
                        <span>{'$'.repeat(review.priceRange)}</span>
                        {getFeaturedTag(review) ? (
                          <>
                            <span className="mx-2 text-slate-400">•</span>
                            <span>{getFeaturedTag(review)}</span>
                          </>
                        ) : null}
                      </div>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-500 border border-slate-200 capitalize">
                          {review.venueType}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}


