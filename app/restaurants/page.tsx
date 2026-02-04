import { getAllReviews } from '@/lib/db-reviews';
import ReviewCard from '@/components/ReviewCard';
import Link from 'next/link';

export const revalidate = 0;

const PAGE_SIZE = 15;

export default async function RestaurantsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const sp = (await searchParams) || {};
  const pageParam = Number.parseInt(sp.page || '1', 10);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const allReviews = await getAllReviews();
  const reviews = allReviews
    .filter((r) => !r.isDraft && r.contentType === 'review' && r.venueType === 'restaurant')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const totalPages = Math.max(1, Math.ceil(reviews.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const pageReviews = reviews.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Restaurants
          </h1>
          <p className="mt-2 text-slate-600">Food-first spots (non-bars).</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pageReviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>

        {/* Pagination */}
        {reviews.length > PAGE_SIZE && (
          <div className="mt-12 flex justify-center">
            <div className="flex items-center gap-2">
              <Link
                href={safePage <= 1 ? '/restaurants' : `/restaurants?page=${safePage - 1}`}
                aria-disabled={safePage <= 1}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${safePage <= 1
                    ? 'pointer-events-none opacity-50 bg-white border-slate-200 text-slate-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                Prev
              </Link>
              <div className="px-3 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg">
                Page {safePage} / {totalPages}
              </div>
              <Link
                href={safePage >= totalPages ? `/restaurants?page=${totalPages}` : `/restaurants?page=${safePage + 1}`}
                aria-disabled={safePage >= totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${safePage >= totalPages
                    ? 'pointer-events-none opacity-50 bg-white border-slate-200 text-slate-500'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                Next
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
