'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Review } from '@/lib/types';
import { Edit, Trash2, Plus, Star } from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast';

interface ToastMessage {
  message: string;
  type: ToastType;
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  useEffect(() => {
    loadReviews();
  }, []);

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

  const filteredReviews = reviews.filter(review =>
    activeTab === 'published' ? !review.isDraft : review.isDraft
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
            Manage Reviews
          </h1>
          <p className="text-gray-600">{reviews.length} total reviews</p>
        </div>
        <Link
          href="/admin/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Add New Review
        </Link>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8">
          <button
            onClick={() => setActiveTab('published')}
            className={`pb-4 px-1 font-medium transition-colors relative ${
              activeTab === 'published'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Published ({reviews.filter(r => !r.isDraft).length})
            {activeTab === 'published' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('drafts')}
            className={`pb-4 px-1 font-medium transition-colors relative ${
              activeTab === 'drafts'
                ? 'text-primary'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Drafts ({reviews.filter(r => r.isDraft).length})
            {activeTab === 'drafts' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>
      </div>

      {filteredReviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">
            {activeTab === 'published' ? 'No published reviews yet' : 'No drafts yet'}
          </p>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus size={20} />
            Add Your First Review
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Restaurant
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredReviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.coverImage}
                        alt={review.restaurantName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {review.restaurantName}
                          </span>
                          {review.isDraft && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">
                              DRAFT
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">
                          {review.location.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-primary font-semibold">
                      <Star size={16} fill="currentColor" />
                      {review.rating}/10
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {formatDate(review.publishedAt)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {review.author}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/reviews/${review.slug}`}
                        className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {review.isDraft ? 'Preview' : 'View'}
                      </Link>
                      <Link
                        href={`/admin/new?edit=${review.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(review.id, review.restaurantName)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-2">Delete Review?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete the review for <strong>{deleteConfirm.name}</strong>? This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
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
