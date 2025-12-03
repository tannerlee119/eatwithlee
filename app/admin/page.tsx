'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Review } from '@/lib/types';
import { Edit, Trash2, Plus, Star, Search, Filter, MoreHorizontal, LayoutGrid, List as ListIcon } from 'lucide-react';
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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchQuery, setSearchQuery] = useState('');

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
      setReviews(data);
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

  const filteredReviews = reviews
    .filter(review => activeTab === 'published' ? !review.isDraft : review.isDraft)
    .filter(review => 
      review.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const stats = {
    total: reviews.length,
    published: reviews.filter(r => !r.isDraft).length,
    drafts: reviews.filter(r => r.isDraft).length,
    avgRating: (reviews.reduce((acc, curr) => acc + curr.rating, 0) / (reviews.length || 1)).toFixed(1)
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
    <div className="min-h-screen bg-surface pb-20">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Reviews', value: stats.total, color: 'bg-blue-50 text-blue-700' },
            { label: 'Published', value: stats.published, color: 'bg-green-50 text-green-700' },
            { label: 'Drafts', value: stats.drafts, color: 'bg-yellow-50 text-yellow-700' },
            { label: 'Avg Rating', value: stats.avgRating, color: 'bg-purple-50 text-purple-700' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-border shadow-soft">
              <p className="text-sm font-medium text-muted mb-1">{stat.label}</p>
              <div className={`text-2xl font-bold ${stat.color.split(' ')[1]}`}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Controls & Filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex bg-white p-1 rounded-lg border border-border shadow-sm">
            <button
              onClick={() => setActiveTab('published')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'published'
                  ? 'bg-secondary text-secondary-foreground shadow-sm'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              Published
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === 'drafts'
                  ? 'bg-secondary text-secondary-foreground shadow-sm'
                  : 'text-muted hover:text-secondary'
              }`}
            >
              Drafts
            </button>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              />
            </div>
            <div className="flex bg-white border border-border rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'list' ? 'bg-accent text-accent-foreground' : 'text-muted hover:text-secondary'
                }`}
              >
                <ListIcon size={18} />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid' ? 'bg-accent text-accent-foreground' : 'text-muted hover:text-secondary'
                }`}
              >
                <LayoutGrid size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {filteredReviews.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-border border-dashed">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="text-muted" size={24} />
            </div>
            <h3 className="text-lg font-medium text-secondary mb-1">No reviews found</h3>
            <p className="text-muted mb-6">
              {searchQuery ? 'Try adjusting your search terms' : `No ${activeTab} reviews yet`}
            </p>
            {!searchQuery && (
              <Link
                href="/admin/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Plus size={18} />
                Create Review
              </Link>
            )}
          </div>
        ) : viewMode === 'list' ? (
          <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Restaurant</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Rating</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredReviews.map((review) => (
                  <tr key={review.id} className="group hover:bg-surface/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-accent overflow-hidden flex-shrink-0 border border-border">
                          {review.coverImage ? (
                            <img src={review.coverImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted">
                              <Star size={16} />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-secondary">{review.restaurantName}</div>
                          <div className="text-xs text-muted">{review.location.address}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-medium">
                        <Star size={12} fill="currentColor" />
                        {review.rating}/10
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {formatDate(review.publishedAt)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/reviews/${review.slug}`}
                          className="p-2 text-muted hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                          title="View"
                        >
                          <Star size={16} />
                        </Link>
                        <Link
                          href={`/admin/new?edit=${review.id}`}
                          className="p-2 text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit size={16} />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(review.id, review.restaurantName)}
                          className="p-2 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-border shadow-card hover:shadow-soft transition-all group overflow-hidden">
                <div className="aspect-video bg-accent relative overflow-hidden">
                  {review.coverImage ? (
                    <img src={review.coverImage} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <Star size={32} />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold text-primary shadow-sm flex items-center gap-1">
                    <Star size={12} fill="currentColor" />
                    {review.rating}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-secondary mb-1 truncate">{review.restaurantName}</h3>
                  <p className="text-xs text-muted mb-4 truncate">{review.location.address}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-xs text-muted">{formatDate(review.publishedAt)}</span>
                    <div className="flex gap-1">
                      <Link
                        href={`/admin/new?edit=${review.id}`}
                        className="p-1.5 text-muted hover:text-secondary hover:bg-accent rounded-md transition-colors"
                      >
                        <Edit size={14} />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(review.id, review.restaurantName)}
                        className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
