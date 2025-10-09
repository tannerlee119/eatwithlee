'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Review } from '@/lib/types';
import { Edit, Trash2, Plus, Star } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
      alert('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string, restaurantName: string) => {
    if (!confirm(`Are you sure you want to delete the review for "${restaurantName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete review');
      }

      alert(' Review deleted successfully!');
      loadReviews(); // Reload the list
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

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
          href="/admin"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={20} />
          Add New Review
        </Link>
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No reviews yet</p>
          <Link
            href="/admin"
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
              {reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.coverImage}
                        alt={review.restaurantName}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {review.restaurantName}
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
                        View
                      </Link>
                      <Link
                        href={`/admin?edit=${review.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
                      >
                        <Edit size={14} />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(review.id, review.restaurantName)}
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
    </div>
  );
}
