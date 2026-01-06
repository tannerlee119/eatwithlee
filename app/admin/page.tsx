'use client';

import { useEffect, useMemo, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Review } from '@/lib/types';
import { Edit, Trash2, Plus, Star, Search, MapPin } from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast';

interface ToastMessage {
  message: string;
  type: ToastType;
}

function AdminReviewsContent() {
  const searchParams = useSearchParams();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [page, setPage] = useState(1);

  const PAGE_SIZE = 25;

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  useEffect(() => {
    loadReviews();

    const message = searchParams.get('message');
    if (message) {
      showToast(message, 'success');
      window.history.replaceState({}, '', '/admin');
    }
  }, [searchParams]);

  const loadReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      const sorted = (data as Review[]).slice().sort((a, b) => {
        const aTime = new Date(a.publishedAt || 0).getTime();
        const bTime = new Date(b.publishedAt || 0).getTime();
        return bTime - aTime;
      });
      setReviews(sorted);
    } catch (error) {
      console.error('Error loading reviews:', error);
      showToast('Failed to load reviews', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: string, restaurantName: string) => {
    setDeleteConfirm({ id, name: restaurantName });
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    try {
      const response = await fetch(`/api/reviews/${deleteConfirm.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      showToast('Review deleted successfully!', 'success');
      loadReviews();
      setDeleteConfirm(null);
    } catch (error) {
      console.error('Error deleting review:', error);
      showToast('Failed to delete review. Please try again.', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const tabbedReviews = useMemo(() => {
    return reviews.filter((review) => (activeTab === 'published' ? !review.isDraft : review.isDraft));
  }, [reviews, activeTab]);

  const cuisinesWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of tabbedReviews) {
      for (const c of r.tags?.cuisines || []) {
        const key = c.trim();
        if (!key) continue;
        counts.set(key, (counts.get(key) || 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [tabbedReviews]);

  const locationsWithCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of tabbedReviews) {
      const key = (r.locationTag || '').trim() || (r.location?.address || '').trim();
      if (!key) continue;
      counts.set(key, (counts.get(key) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);
  }, [tabbedReviews]);

  const filteredReviews = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return tabbedReviews.filter((review) => {
      if (selectedCuisine) {
        const cuisines = review.tags?.cuisines || [];
        if (!cuisines.includes(selectedCuisine)) return false;
      }
      if (selectedLocation) {
        const loc = (review.locationTag || '').trim() || (review.location?.address || '').trim();
        if (loc !== selectedLocation) return false;
      }
      if (!q) return true;
      return (
        review.restaurantName.toLowerCase().includes(q) ||
        (review.location?.address || '').toLowerCase().includes(q) ||
        (review.locationTag || '').toLowerCase().includes(q)
      );
    });
  }, [tabbedReviews, searchQuery, selectedCuisine, selectedLocation]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, searchQuery, selectedCuisine, selectedLocation]);

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredReviews.length);
  const pageItems = filteredReviews.slice(startIndex, endIndex);

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => !r.isDraft).length,
    drafts: reviews.filter(r => r.isDraft).length,
    avgRating: (reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)).toFixed(1)
  };

  const featuredReview = useMemo(() => {
    const list = filteredReviews.length ? filteredReviews : tabbedReviews;
    if (!list.length) return null;
    // Prefer a high-rated recent review to highlight
    const sorted = list.slice().sort((a, b) => {
      const scoreA = (a.rating || 0) * 10 + new Date(a.publishedAt || 0).getTime() / 1e12;
      const scoreB = (b.rating || 0) * 10 + new Date(b.publishedAt || 0).getTime() / 1e12;
      return scoreB - scoreA;
    });
    return sorted[0];
  }, [filteredReviews, tabbedReviews]);

  const clearFilters = () => {
    setSelectedCuisine('');
    setSelectedLocation('');
    setSearchQuery('');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 bg-primary rounded-full mb-4"></div>
          <p className="text-muted font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header Section */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-display font-bold text-secondary">
              Admin Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-muted hover:text-secondary transition-colors"
              >
                View Site
              </Link>
              <Link
                href="/admin/new"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
              >
                <Plus size={18} />
                New Review
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full py-6">
          {/* Top Controls */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
            <div className="flex bg-white p-1 rounded-lg border border-border shadow-sm w-full sm:w-auto">
              <button
                onClick={() => setActiveTab('published')}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'published'
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'text-muted hover:text-secondary'
                }`}
              >
                Published
              </button>
              <button
                onClick={() => setActiveTab('drafts')}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === 'drafts'
                    ? 'bg-secondary text-secondary-foreground shadow-sm'
                    : 'text-muted hover:text-secondary'
                }`}
              >
                Drafts
              </button>
            </div>

            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white"
                />
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-2 text-sm font-medium text-secondary bg-white border border-border rounded-lg hover:bg-accent/40 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Two-column layout w/ independent scroll */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100%-3.5rem)]">
            {/* Left: Feed */}
            <div className="lg:col-span-8 xl:col-span-9 h-full overflow-hidden">
              <div className="h-full overflow-y-auto pr-1">
                {/* Small stats bar */}
                <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Total', value: stats.total, tone: 'bg-white' },
                    { label: 'Published', value: stats.published, tone: 'bg-white' },
                    { label: 'Drafts', value: stats.drafts, tone: 'bg-white' },
                    { label: 'Avg Rating', value: stats.avgRating, tone: 'bg-white' },
                  ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl border border-border shadow-soft ${stat.tone}`}>
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                      <div className="text-2xl font-bold text-secondary">{stat.value}</div>
                    </div>
                  ))}
                </div>

                {filteredReviews.length === 0 ? (
                  <div className="text-center py-20 bg-white rounded-xl border border-border border-dashed">
                    <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="text-muted" size={24} />
                    </div>
                    <h3 className="text-lg font-medium text-secondary mb-1">No reviews found</h3>
                    <p className="text-muted mb-6">
                      {searchQuery || selectedCuisine || selectedLocation
                        ? 'Try adjusting your filters'
                        : `No ${activeTab} reviews yet`}
                    </p>
                    {!searchQuery && !selectedCuisine && !selectedLocation && (
                      <Link
                        href="/admin/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        <Plus size={18} />
                        Create Review
                      </Link>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="columns-1 sm:columns-2 xl:columns-3 gap-6 [column-fill:_balance]">
                      {pageItems.map((review) => {
                        const locationLabel = (review.locationTag || '').trim() || (review.location?.address || '').trim();
                        const excerpt = (review.excerpt || '').trim();
                        const shouldClamp = excerpt.length > 150;
                        return (
                          <div key={review.id} className="mb-6 break-inside-avoid">
                            <div className="bg-white rounded-2xl border border-border shadow-card hover:shadow-soft transition-all overflow-hidden group">
                              <div className="aspect-[16/10] bg-accent relative overflow-hidden">
                                {review.coverImage ? (
                                  <Image
                                    src={review.coverImage}
                                    alt={review.restaurantName}
                                    fill
                                    sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 60vw, 100vw"
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    quality={65}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-muted">
                                    <Star size={28} />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="absolute top-3 left-3 flex items-center gap-2">
                                  {review.isDraft && (
                                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-50 text-yellow-800 border border-yellow-200">
                                      Draft
                                    </span>
                                  )}
                                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 backdrop-blur text-slate-900 border border-white/30">
                                    {review.venueType}
                                  </span>
                                </div>

                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                                  <Star size={12} fill="currentColor" />
                                  {review.rating}/10
                                </div>
                              </div>

                              <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                  <div>
                                    <h3 className="font-display font-bold text-lg text-secondary leading-tight">
                                      {review.restaurantName}
                                    </h3>
                                    {locationLabel && (
                                      <div className="mt-1 flex items-center gap-2 text-xs text-muted">
                                        <MapPin size={14} />
                                        <span className="truncate">{locationLabel}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {excerpt && (
                                  <p className={`mt-4 text-sm text-slate-700 leading-relaxed ${shouldClamp ? 'line-clamp-3' : ''}`}>
                                    {excerpt}
                                  </p>
                                )}

                                <div className="mt-5 pt-4 border-t border-border flex items-center justify-between gap-2">
                                  <span className="text-xs text-muted">{formatDate(review.publishedAt)}</span>
                                  <div className="flex items-center gap-1.5">
                                    <Link
                                      href={`/admin/new?edit=${review.id}`}
                                      className="px-3 py-1.5 text-xs font-semibold text-secondary bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                                    >
                                      Edit
                                    </Link>
                                    {!review.isDraft && (
                                      <Link
                                        href={`/reviews/${review.slug}`}
                                        className="px-3 py-1.5 text-xs font-semibold text-white bg-secondary hover:bg-secondary/90 rounded-lg transition-colors"
                                      >
                                        View
                                      </Link>
                                    )}
                                    <button
                                      onClick={() => handleDeleteClick(review.id, review.restaurantName)}
                                      className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                      title="Delete"
                                      type="button"
                                    >
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    <div className="sticky bottom-0 mt-8 bg-surface/85 backdrop-blur border-t border-border py-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="text-sm text-muted">
                          Showing <span className="font-semibold text-secondary">{filteredReviews.length ? startIndex + 1 : 0}</span>–
                          <span className="font-semibold text-secondary">{endIndex}</span> of{' '}
                          <span className="font-semibold text-secondary">{filteredReviews.length}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={safePage <= 1}
                            className="px-3 py-2 text-sm font-medium bg-white border border-border rounded-lg hover:bg-accent/40 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Prev
                          </button>
                          <div className="px-3 py-2 text-sm font-semibold text-secondary bg-white border border-border rounded-lg">
                            Page {safePage} / {totalPages}
                          </div>
                          <button
                            type="button"
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            disabled={safePage >= totalPages}
                            className="px-3 py-2 text-sm font-medium bg-white border border-border rounded-lg hover:bg-accent/40 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Sidebar */}
            <aside className="lg:col-span-4 xl:col-span-3 h-full overflow-hidden">
              <div className="h-full overflow-y-auto">
                {/* Featured */}
                <div className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden mb-6">
                  <div className="p-5 border-b border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Featured</p>
                    <h2 className="mt-2 font-display font-bold text-xl text-secondary leading-tight">
                      {featuredReview ? featuredReview.restaurantName : 'No reviews yet'}
                    </h2>
                    {featuredReview && (
                      <p className="mt-1 text-sm text-muted">{formatDate(featuredReview.publishedAt)}</p>
                    )}
                  </div>
                  <div className="aspect-[4/3] bg-accent relative">
                    {featuredReview?.coverImage ? (
                      <Image
                        src={featuredReview.coverImage}
                        alt={featuredReview.restaurantName}
                        fill
                        sizes="(min-width: 1024px) 320px, 100vw"
                        className="object-cover"
                        quality={65}
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted">
                        <Star size={36} />
                      </div>
                    )}
                    {featuredReview && (
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold text-slate-900 shadow-sm flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        {featuredReview.rating}/10
                      </div>
                    )}
                  </div>
                  {featuredReview && (
                    <div className="p-5">
                      <div className="flex items-center gap-2 text-xs text-muted mb-4">
                        <MapPin size={14} />
                        <span className="truncate">
                          {(featuredReview.locationTag || '').trim() || (featuredReview.location?.address || '').trim()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/new?edit=${featuredReview.id}`}
                          className="flex-1 text-center px-3 py-2 text-sm font-semibold text-secondary bg-accent hover:bg-accent/80 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        {!featuredReview.isDraft && (
                          <Link
                            href={`/reviews/${featuredReview.slug}`}
                            className="flex-1 text-center px-3 py-2 text-sm font-semibold text-white bg-secondary hover:bg-secondary/90 rounded-lg transition-colors"
                          >
                            View
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cuisines */}
                <div className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden mb-6">
                  <div className="p-5 border-b border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Cuisines</p>
                    <p className="mt-2 text-sm text-muted">Filter the feed by cuisine.</p>
                  </div>
                  <div className="p-4">
                    {cuisinesWithCounts.length === 0 ? (
                      <p className="text-sm text-muted">No cuisine tags yet.</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {cuisinesWithCounts.map(([cuisine, count]) => (
                          <button
                            key={cuisine}
                            type="button"
                            onClick={() => setSelectedCuisine((prev) => (prev === cuisine ? '' : cuisine))}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedCuisine === cuisine
                                ? 'bg-secondary text-secondary-foreground'
                                : 'hover:bg-accent/40 text-secondary'
                            }`}
                          >
                            <span className="font-semibold">{cuisine}</span>
                            <span className={`text-xs font-bold ${selectedCuisine === cuisine ? 'text-secondary-foreground/80' : 'text-muted'}`}>
                              {count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Locations */}
                <div className="bg-white rounded-2xl border border-border shadow-soft overflow-hidden mb-6">
                  <div className="p-5 border-b border-border">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">Locations</p>
                    <p className="mt-2 text-sm text-muted">Filter the feed by city/neighborhood.</p>
                  </div>
                  <div className="p-4">
                    {locationsWithCounts.length === 0 ? (
                      <p className="text-sm text-muted">No location tags yet.</p>
                    ) : (
                      <div className="flex flex-col gap-1">
                        {locationsWithCounts.map(([loc, count]) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setSelectedLocation((prev) => (prev === loc ? '' : loc))}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                              selectedLocation === loc
                                ? 'bg-secondary text-secondary-foreground'
                                : 'hover:bg-accent/40 text-secondary'
                            }`}
                          >
                            <span className="font-semibold truncate text-left">{loc}</span>
                            <span className={`text-xs font-bold flex-shrink-0 ${selectedLocation === loc ? 'text-secondary-foreground/80' : 'text-muted'}`}>
                              {count}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-xs text-muted px-2 pb-6">
                  Inspired by a news-style layout (e.g. [The Needle Drop](https://theneedledrop.com/)).
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-secondary/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-border animate-fade-in-up">
            <h3 className="text-lg font-semibold text-secondary mb-2">Delete Review?</h3>
            <p className="text-muted mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-secondary bg-accent hover:bg-accent/80 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Delete Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading...</div>
      </div>
    }>
      <AdminReviewsContent />
    </Suspense>
  );
}
