import { getAllReviews } from '@/lib/db-reviews';
import { getAllLists } from '@/lib/db-lists';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star } from 'lucide-react';

export const revalidate = 0;

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; cuisine?: string; location?: string }>;
}) {
  const sp = (await searchParams) || {};
  const pageParam = Number.parseInt(sp.page || '1', 10);
  const pageSize = 10;
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const selectedCuisine = (sp.cuisine || '').trim();
  const selectedLocation = (sp.location || '').trim();

  const allReviews = await getAllReviews();
  let featuredList: Awaited<ReturnType<typeof getAllLists>>[0] | null = null;
  try {
    const lists = await getAllLists();
    featuredList = lists.find((l) => !l.isDraft) || null;
  } catch {
    // List table may not exist yet
  }

  const all = allReviews
    .filter((r) => !r.isDraft && r.contentType === 'review')
    .slice()
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  const cuisinesWithCounts = (() => {
    const counts = new Map<string, number>();
    for (const r of all) {
      for (const c of r.tags?.cuisines || []) {
        const key = (c || '').trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  })();

  const locationsWithCounts = (() => {
    const counts = new Map<string, number>();
    for (const r of all) {
      const key = (r.locationTag || '').trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  })();

  const filtered = all.filter((r) => {
    if (selectedCuisine) {
      const cuisines = r.tags?.cuisines || [];
      if (!cuisines.includes(selectedCuisine)) return false;
    }
    if (selectedLocation) {
      const loc = (r.locationTag || '').trim();
      if (loc !== selectedLocation) return false;
    }
    return true;
  });

  // Featured should be stable and NOT change based on active filters/pagination.
  // If admin selected one, use it. Otherwise fall back to "high-rated recent".
  const featuredReview = (() => {
    if (!all.length) return null;
    const picked = all.find((r) => r.isFeatured);
    if (picked) return picked;
    const sorted = all.slice().sort((a, b) => {
      const scoreA = (a.rating || 0) * 10 + new Date(a.publishedAt).getTime() / 1e12;
      const scoreB = (b.rating || 0) * 10 + new Date(b.publishedAt).getTime() / 1e12;
      return scoreB - scoreA;
    });
    return sorted[0];
  })();

  // Exclude featured from the main feed to avoid duplicates.
  const feedBase = featuredReview ? all.filter((r) => r.id !== featuredReview.id) : all;
  const feedFiltered = feedBase.filter((r) => {
    if (selectedCuisine) {
      const cuisines = r.tags?.cuisines || [];
      if (!cuisines.includes(selectedCuisine)) return false;
    }
    if (selectedLocation) {
      const loc = (r.locationTag || '').trim();
      if (loc !== selectedLocation) return false;
    }
    return true;
  });

  // Build a unified feed merging reviews + lists, sorted by date
  type FeedItem = { type: 'review'; data: typeof feedFiltered[0] } | { type: 'list'; data: NonNullable<typeof featuredList> };
  const mergedFeed: FeedItem[] = feedFiltered.map((r) => ({ type: 'review' as const, data: r }));
  if (featuredList && !selectedCuisine && !selectedLocation) {
    mergedFeed.push({ type: 'list' as const, data: featuredList });
    mergedFeed.sort((a, b) => {
      const dateA = a.type === 'review' ? a.data.publishedAt : a.data.publishedAt;
      const dateB = b.type === 'review' ? b.data.publishedAt : b.data.publishedAt;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
  }

  const totalPages = Math.max(1, Math.ceil(mergedFeed.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, mergedFeed.length);
  const pageFeed = mergedFeed.slice(startIndex, endIndex);

  const baseHref = (params: { page?: number; cuisine?: string; location?: string }) => {
    const qs = new URLSearchParams();
    if (params.page && params.page > 1) qs.set('page', String(params.page));
    if (params.cuisine) qs.set('cuisine', params.cuisine);
    if (params.location) qs.set('location', params.location);
    const s = qs.toString();
    return s ? `/reviews?${s}` : '/reviews';
  };

  const normalizeImageSrc = (src: string): string | null => {
    const trimmed = (src || '').trim();
    if (!trimmed) return null;
    if (trimmed.startsWith('/')) return trimmed;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      // Handle stored paths like "uploads/xxx.jpg"
      return `/${trimmed}`;
    }
    try {
      // Validate URL
      // eslint-disable-next-line no-new
      new URL(trimmed);
      return trimmed;
    } catch {
      return null;
    }
  };

  const shouldUseNextImage = (src: string): boolean => {
    if (src.startsWith('/')) return true;
    try {
      const u = new URL(src);
      return ['utfs.io', 'uploadthing.com', 'files.uploadthing.com'].includes(u.hostname);
    } catch {
      return false;
    }
  };

  // Crop semantics match `components/ReviewCard.tsx`:
  // x/y represent the focal point (%) that should be centered in the container.
  const getCropStyle = (crop?: { x: number; y: number; zoom: number }) => {
    if (!crop) return null;
    const zoom = Number.isFinite(crop.zoom) ? crop.zoom : 1;
    const x = Number.isFinite(crop.x) ? crop.x : 50;
    const y = Number.isFinite(crop.y) ? crop.y : 50;
    return {
      width: `${Math.max(1, zoom) * 100}%`,
      height: 'auto',
      left: '50%',
      top: '50%',
      transform: `translate(-${x}%, -${y}%)`,
    } as const;
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8" style={{ animation: 'fadeInUp 0.6s ease-out 0.02s both' }}>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900">
            Reviews
          </h1>
          <p className="mt-2 text-slate-600">All restaurant reviews.</p>
        </div>

        {/* Mobile Featured Post - shown only on small screens */}
        {featuredReview && (
          <div className="mb-8 lg:hidden">
            <Link
              href={`/reviews/${featuredReview.slug}`}
              className="block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[16/9] bg-slate-100 relative overflow-hidden rounded-t-2xl">
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-sm uppercase">
                  <span>FEATURED</span>
                </div>
                {featuredReview.coverImage ? (() => {
                  const src = normalizeImageSrc(featuredReview.coverImage || '');
                  if (!src) {
                    return (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Star size={36} />
                      </div>
                    );
                  }
                  const cropStyle = getCropStyle(featuredReview.coverImageCrop);
                  if (cropStyle) {
                    return (
                      <img
                        src={src}
                        alt={featuredReview.restaurantName}
                        loading="eager"
                        decoding="async"
                        className="absolute transition-transform duration-500 ease-out"
                        style={cropStyle}
                      />
                    );
                  }
                  return shouldUseNextImage(src) ? (
                    <Image
                      src={src}
                      alt={featuredReview.restaurantName}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      quality={80}
                      priority
                    />
                  ) : (
                    <img
                      src={src}
                      alt={featuredReview.restaurantName}
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  );
                })() : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Star size={36} />
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-display font-bold text-2xl text-slate-900 leading-[1.1] tracking-tight">
                  {featuredReview.restaurantName || featuredReview.title}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                  <MapPin size={16} />
                  <span className="truncate">
                    {(featuredReview.locationTag || '').trim() || (featuredReview.location?.address || '').trim()}
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Two-column layout w/ independent scroll */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Feed */}
          <div className="lg:col-span-8 xl:col-span-9">
            {feedFiltered.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-slate-200 border-dashed">
                <h3 className="text-lg font-medium text-slate-900 mb-1">No reviews found</h3>
                <p className="text-slate-600 mb-6">Try clearing your filters.</p>
                <Link
                  href="/reviews"
                  className="inline-flex items-center justify-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <>
                <div
                  className="md:columns-2 gap-8 space-y-8"
                  key={`${selectedCuisine}::${selectedLocation}::${safePage}`}
                >
                  {pageFeed.map((item, index) => {
                    if (item.type === 'list') {
                      const list = item.data;
                      const listDate = new Date(list.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                      return (
                        <div key={`list-${list.id}`} className="break-inside-avoid" style={{ animation: `fadeInUp 0.6s ease-out ${0.06 + index * 0.05}s both` }}>
                          <Link
                            href={`/lists/${list.slug}`}
                            className="group block"
                          >
                            <article className="bg-slate-900 rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1">
                              <div className="aspect-[4/3] flex flex-col items-center justify-center p-8 text-center">
                                <div className="flex items-center gap-1.5 mb-4">
                                  <Star size={14} fill="currentColor" className="text-amber-400" />
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Curated List</span>
                                </div>
                                <h2 className="text-2xl font-display font-bold text-white mb-3 group-hover:text-slate-200 transition-colors">
                                  {list.title}
                                </h2>
                                {list.description && (
                                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 max-w-xs">
                                    {list.description}
                                  </p>
                                )}
                                <div className="mt-4 text-sm font-bold text-white uppercase tracking-wider group-hover:gap-3 inline-flex items-center gap-2 transition-all">
                                  {list.items.length} spots →
                                </div>
                              </div>
                              <div className="px-6 pb-4">
                                <span className="text-xs text-slate-500">{listDate}</span>
                              </div>
                            </article>
                          </Link>
                        </div>
                      );
                    }
                    const review = item.data;
                    const locationLabel = (review.locationTag || '').trim() || (review.location?.address || '').trim();
                    const excerpt = (review.excerpt || '').trim();
                    const shouldClamp = excerpt.length > 150;
                    const imgSrc = normalizeImageSrc(review.coverImage || '');
                    const cropStyle = getCropStyle(review.coverImageCrop);
                    const reviewDate = new Date(review.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
                    return (
                      <div
                        key={review.id}
                        className="break-inside-avoid"
                        style={{ animation: `fadeInUp 0.6s ease-out ${0.06 + index * 0.05}s both` }}
                      >
                        <Link
                          href={`/reviews/${review.slug}`}
                          className="block bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group"
                        >
                          <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                            {imgSrc ? (
                              cropStyle ? (
                                <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:scale-105">
                                  <img
                                    src={imgSrc}
                                    alt={review.restaurantName}
                                    loading="lazy"
                                    decoding="async"
                                    className="absolute"
                                    style={cropStyle}
                                  />
                                </div>
                              ) : shouldUseNextImage(imgSrc) ? (
                                <Image
                                  src={imgSrc}
                                  alt={review.restaurantName}
                                  fill
                                  sizes="(min-width: 1024px) 42vw, 100vw"
                                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                                  quality={75}
                                />
                              ) : (
                                <img
                                  src={imgSrc}
                                  alt={review.restaurantName}
                                  loading="lazy"
                                  decoding="async"
                                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              )
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-400">
                                <Star size={28} />
                              </div>
                            )}

                          </div>

                          <div className="p-6">
                            <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 leading-[1.05] tracking-tight">
                              {review.restaurantName}
                            </h3>
                            {locationLabel && (
                              <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                                <MapPin size={16} />
                                <span className="truncate">{locationLabel}</span>
                              </div>
                            )}
                            {excerpt && (
                              <p className={`mt-4 text-base text-slate-700 leading-relaxed ${shouldClamp ? 'line-clamp-3' : ''}`}>
                                {excerpt}
                              </p>
                            )}
                            <div className="mt-3">
                              <span className="text-xs text-slate-400">{reviewDate}</span>
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination */}
                {mergedFeed.length > pageSize && (
                  <div className="mt-12 flex justify-center">
                    <div className="flex items-center gap-2">
                      <Link
                        href={baseHref({ page: Math.max(1, safePage - 1), cuisine: selectedCuisine || undefined, location: selectedLocation || undefined })}
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
                        href={baseHref({ page: Math.min(totalPages, safePage + 1), cuisine: selectedCuisine || undefined, location: selectedLocation || undefined })}
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
              </>
            )}
          </div>

          {/* Right: Sidebar */}
          <aside className="lg:col-span-4 xl:col-span-3 space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Featured - hidden on mobile, shown in sidebar on desktop */}
            <Link
              href={featuredReview ? `/reviews/${featuredReview.slug}` : '#'}
              className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden rounded-t-2xl">
                {/* Featured Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[10px] font-bold tracking-wider shadow-sm uppercase">
                  <span>FEATURED</span>
                </div>

                {featuredReview?.coverImage ? (() => {
                  const src = normalizeImageSrc(featuredReview.coverImage || '');
                  if (!src) {
                    return (
                      <div className="w-full h-full flex items-center justify-center text-slate-400">
                        <Star size={36} />
                      </div>
                    );
                  }
                  const cropStyle = getCropStyle(featuredReview.coverImageCrop);
                  if (cropStyle) {
                    return (
                      <img
                        src={src}
                        alt={featuredReview.restaurantName}
                        loading="eager"
                        decoding="async"
                        className="absolute transition-transform duration-500 ease-out"
                        style={cropStyle}
                      />
                    );
                  }
                  return shouldUseNextImage(src) ? (
                    <Image
                      src={src}
                      alt={featuredReview.restaurantName}
                      fill
                      sizes="(min-width: 1024px) 320px, 100vw"
                      className="object-cover"
                      quality={80}
                      priority
                    />
                  ) : (
                    <img
                      src={src}
                      alt={featuredReview.restaurantName}
                      loading="eager"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  );
                })() : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <Star size={36} />
                  </div>
                )}

              </div>
              <div className="p-5">
                {featuredReview ? (
                  <>
                    <h2 className="font-display font-bold text-2xl text-slate-900 leading-[1.1] tracking-tight">
                      {featuredReview.restaurantName || featuredReview.title}
                    </h2>
                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={16} />
                      <span className="truncate">
                        {(featuredReview.locationTag || '').trim() || (featuredReview.location?.address || '').trim()}
                      </span>
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-600">No featured review yet.</p>
                )}
              </div>
            </Link>

            {/* Cuisines */}
            <div
              className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.14s both' }}
            >
              <div className="p-5 border-b border-slate-200">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Cuisines</p>
              </div>
              <div className="p-4">
                {cuisinesWithCounts.length === 0 ? (
                  <p className="text-sm text-slate-600">No cuisine tags yet.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {cuisinesWithCounts.map(([cuisine]) => {
                      const active = selectedCuisine === cuisine;
                      return (
                        <Link
                          key={cuisine}
                          href={baseHref({
                            page: 1,
                            cuisine: active ? undefined : cuisine,
                            location: selectedLocation || undefined,
                          })}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-900'
                            }`}
                        >
                          <span className="font-semibold">{cuisine}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Locations */}
            <div
              className="hidden lg:block bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
              style={{ animation: 'fadeInUp 0.6s ease-out 0.2s both' }}
            >
              <div className="p-5 border-b border-slate-200">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Locations</p>
              </div>
              <div className="p-4">
                {locationsWithCounts.length === 0 ? (
                  <p className="text-sm text-slate-600">No location tags yet.</p>
                ) : (
                  <div className="flex flex-col gap-1">
                    {locationsWithCounts.map(([loc]) => {
                      const active = selectedLocation === loc;
                      return (
                        <Link
                          key={loc}
                          href={baseHref({
                            page: 1,
                            cuisine: selectedCuisine || undefined,
                            location: active ? undefined : loc,
                          })}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${active ? 'bg-slate-900 text-white' : 'hover:bg-slate-50 text-slate-900'
                            }`}
                        >
                          <span className="font-semibold truncate">{loc}</span>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {(selectedCuisine || selectedLocation) && (
              <Link
                href="/reviews"
                className="hidden lg:block text-center px-4 py-2 text-sm font-semibold text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear filters
              </Link>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}


