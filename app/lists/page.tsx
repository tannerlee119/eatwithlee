import Link from 'next/link';
import { getAllReviews } from '@/lib/db-reviews';
import { Star } from 'lucide-react';

export const revalidate = 0;

export default async function ListsPage() {
  const allReviews = await getAllReviews();

  const lists = allReviews
    .filter((r) => !r.isDraft && r.contentType === 'list')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  // Count for the Top Eats 2025 card
  const topEats2025Count = allReviews.filter(
    (r) => !r.isDraft && r.contentType === 'review' && r.rating >= 8 && new Date(r.publishedAt).getFullYear() === 2025
  ).length;

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Lists
          </h1>
          <p className="mt-2 text-slate-600">Curated restaurant rankings and guides.</p>
        </div>

        {/* Featured List Cards */}
        <div className="mb-12">
          <Link
            href="/lists/top-eats-2025"
            className="block bg-slate-900 rounded-2xl overflow-hidden hover:bg-slate-800 transition-colors group"
          >
            <div className="p-8 sm:p-10">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
                <Star size={14} fill="currentColor" className="text-amber-400" />
                <span>Curated List</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight leading-[1.05]">
                Top Eats of 2025
              </h2>
              <p className="mt-3 text-slate-400 text-lg leading-relaxed max-w-lg">
                The best restaurants of the year.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider group-hover:gap-3 transition-all">
                View List ({topEats2025Count} spots) →
              </div>
            </div>
          </Link>
        </div>

        {/* Other lists */}
        {lists.length === 0 ? (
          <p className="text-slate-600">No other lists yet.</p>
        ) : (
          <ul className="space-y-4">
            {lists.map((review) => (
              <li key={review.id} className="border-b border-slate-100 pb-4">
                <Link
                  href={`/reviews/${review.slug}`}
                  className="text-lg font-semibold text-slate-900 hover:text-slate-700 transition-colors underline underline-offset-4 decoration-slate-200 hover:decoration-slate-400"
                >
                  {review.title || review.restaurantName}
                </Link>
                <div className="mt-1 text-sm text-slate-500">
                  {new Date(review.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>
                {review.excerpt ? (
                  <p className="mt-2 text-slate-600">{review.excerpt}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}



