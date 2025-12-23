import Link from 'next/link';
import { getAllReviews } from '@/lib/db-reviews';

export const revalidate = 0;

export default async function ListsPage() {
  const allReviews = await getAllReviews();

  const lists = allReviews
    .filter((r) => !r.isDraft && r.contentType === 'list')
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Lists
          </h1>
          <p className="mt-2 text-slate-600">Curated restaurant rankings and guides.</p>
        </div>

        {lists.length === 0 ? (
          <p className="text-slate-600">No lists yet.</p>
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


