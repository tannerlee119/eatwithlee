import { getAllReviews } from '@/lib/db-reviews';

export const revalidate = 0;

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

export default async function StatsPage() {
  const allReviews = await getAllReviews();
  const published = allReviews.filter((r) => !r.isDraft);

  const total = published.length;
  const loved = published.filter((r) => r.rating >= 8).length;
  const lists = published.filter((r) => r.contentType === 'list').length;

  const avgRating =
    total === 0 ? 0 : published.reduce((sum, r) => sum + (r.rating || 0), 0) / total;

  const cuisineCounts = new Map<string, number>();
  for (const r of published) {
    for (const c of r.tags?.cuisines || []) {
      cuisineCounts.set(c, (cuisineCounts.get(c) || 0) + 1);
    }
  }

  const topCuisines = [...cuisineCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Stats
          </h1>
          <p className="mt-2 text-slate-600">A quick snapshot of the site.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="rounded-xl border border-slate-100 p-6">
            <div className="text-xs uppercase tracking-wide text-slate-400 font-medium">
              Published reviews
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{total}</div>
          </div>

          <div className="rounded-xl border border-slate-100 p-6">
            <div className="text-xs uppercase tracking-wide text-slate-400 font-medium">
              Average rating
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">
              {round1(avgRating)}/10
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 p-6">
            <div className="text-xs uppercase tracking-wide text-slate-400 font-medium">
              Loved (8/10+)
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{loved}</div>
          </div>

          <div className="rounded-xl border border-slate-100 p-6">
            <div className="text-xs uppercase tracking-wide text-slate-400 font-medium">
              Lists
            </div>
            <div className="mt-2 text-3xl font-bold text-slate-900">{lists}</div>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-slate-100 p-6">
          <h2 className="text-lg font-semibold text-slate-900">Top cuisines</h2>
          {topCuisines.length === 0 ? (
            <p className="mt-2 text-slate-600">No cuisine data yet.</p>
          ) : (
            <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {topCuisines.map(([name, count]) => (
                <li key={name} className="flex items-baseline justify-between">
                  <span className="text-slate-700">{name}</span>
                  <span className="text-sm text-slate-500">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}


