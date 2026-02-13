import Link from 'next/link';
import { getAllLists } from '@/lib/db-lists';
import { Star } from 'lucide-react';

export const revalidate = 0;

export default async function ListsPage() {
  const allLists = await getAllLists();
  const publishedLists = allLists.filter((l) => !l.isDraft);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Lists
          </h1>
          <p className="mt-2 text-slate-600">Curated restaurant rankings and guides.</p>
        </div>

        {publishedLists.length === 0 ? (
          <p className="text-slate-600">No lists yet. Check back soon!</p>
        ) : (
          <div className="space-y-6">
            {publishedLists.map((list, idx) => (
              <Link
                key={list.id}
                href={`/lists/${list.slug}`}
                className={`block rounded-2xl overflow-hidden transition-colors group ${idx === 0
                    ? 'bg-slate-900 hover:bg-slate-800'
                    : 'bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
              >
                <div className="p-8 sm:p-10">
                  <div
                    className={`flex items-center gap-2 text-xs font-bold uppercase tracking-widest mb-3 ${idx === 0 ? 'text-slate-400' : 'text-slate-400'
                      }`}
                  >
                    <Star
                      size={14}
                      fill="currentColor"
                      className={idx === 0 ? 'text-amber-400' : 'text-amber-500'}
                    />
                    <span>Curated List</span>
                  </div>
                  <h2
                    className={`text-3xl sm:text-4xl font-display font-bold tracking-tight leading-[1.05] ${idx === 0 ? 'text-white' : 'text-slate-900'
                      }`}
                  >
                    {list.title}
                  </h2>
                  {list.description && (
                    <p
                      className={`mt-3 text-lg leading-relaxed max-w-lg ${idx === 0 ? 'text-slate-400' : 'text-slate-500'
                        }`}
                    >
                      {list.description}
                    </p>
                  )}
                  <div
                    className={`mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider group-hover:gap-3 transition-all ${idx === 0 ? 'text-white' : 'text-slate-900'
                      }`}
                  >
                    View List ({list.items.length} spots) →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
