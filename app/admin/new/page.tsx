'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Review } from '@/lib/types';
import { X, ArrowLeft, Loader2 } from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast';

interface ToastMessage {
  message: string;
  type: ToastType;
}

function AdminForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState<Partial<Review>>({
    title: '',
    restaurantName: '',
    excerpt: '',
    content: '',
    rating: 0,
    location: {
      address: '',
      lat: 0,
      lng: 0,
    },
    tags: {
      cuisines: [],
      vibes: [],
      foodTypes: [],
    },
    favoriteDishes: [],
    coverImage: '',
    images: [],
    author: 'Tanner Lee',
  });

  const [tagInput, setTagInput] = useState({
    cuisine: '',
    vibe: '',
    foodType: '',
    dish: '',
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });
  };

  // Load review data if in edit mode
  useEffect(() => {
    if (editId) {
      setIsLoading(true);
      fetch(`/api/reviews`)
        .then(res => res.json())
        .then(reviews => {
          const review = reviews.find((r: Review) => r.id === editId);
          if (review) {
            setFormData(review);
          }
        })
        .catch(error => {
          console.error('Error loading review:', error);
          showToast('Failed to load review for editing', 'error');
        })
        .finally(() => setIsLoading(false));
    }
  }, [editId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that coordinates have been set
    if (!formData.location?.lat || !formData.location?.lng ||
        formData.location.lat === 0 || formData.location.lng === 0) {
      showToast('Please find coordinates for the restaurant address first', 'error');
      return;
    }

    // Validate that at least one image is uploaded
    if (!formData.images || formData.images.length === 0) {
      showToast('Please add at least one image for the review', 'error');
      return;
    }

    try {
      const url = editId ? `/api/reviews/${editId}` : '/api/reviews';
      const method = editId ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save review');
      }

      const savedReview = await response.json();

      if (editId) {
        showToast('Review updated successfully!', 'success');
        setTimeout(() => router.push('/admin'), 1000);
      } else {
        showToast(`Review created successfully! Slug: ${savedReview.slug}`, 'success');

        // Reset form only on create
        setFormData({
          title: '',
          restaurantName: '',
          excerpt: '',
          content: '',
          rating: 0,
          location: {
            address: '',
            lat: 0,
            lng: 0,
          },
          tags: {
            cuisines: [],
            vibes: [],
            foodTypes: [],
          },
          favoriteDishes: [],
          coverImage: '',
          images: [],
          author: 'Tanner Lee',
        });
        setTagInput({
          cuisine: '',
          vibe: '',
          foodType: '',
          dish: '',
        });
      }
    } catch (error) {
      console.error('Error saving review:', error);
      showToast('Failed to save review. Please try again.', 'error');
    }
  };

  const addTag = (category: 'cuisines' | 'vibes' | 'foodTypes', value: string) => {
    if (value.trim()) {
      setFormData({
        ...formData,
        tags: {
          ...formData.tags!,
          [category]: [...(formData.tags![category] || []), value.trim()],
        },
      });
    }
  };

  const removeTag = (category: 'cuisines' | 'vibes' | 'foodTypes', index: number) => {
    setFormData({
      ...formData,
      tags: {
        ...formData.tags!,
        [category]: formData.tags![category].filter((_, i) => i !== index),
      },
    });
  };

  const addDish = (dish: string) => {
    if (dish.trim()) {
      setFormData({
        ...formData,
        favoriteDishes: [...(formData.favoriteDishes || []), dish.trim()],
      });
    }
  };

  const removeDish = (index: number) => {
    setFormData({
      ...formData,
      favoriteDishes: formData.favoriteDishes?.filter((_, i) => i !== index),
    });
  };

  const removeImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    setFormData({
      ...formData,
      images: newImages,
      // If we removed the cover image, set a new one
      coverImage: formData.coverImage === formData.images?.[index]
        ? (newImages[0] || '')
        : formData.coverImage,
    });
  };

  const setCoverImage = (url: string) => {
    setFormData({
      ...formData,
      coverImage: url,
    });
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;

    // Basic URL validation
    try {
      new URL(imageUrlInput);
      const newImages = [...(formData.images || []), imageUrlInput.trim()];
      const newCoverImage = formData.coverImage || imageUrlInput.trim();

      setFormData({
        ...formData,
        images: newImages,
        coverImage: newCoverImage,
      });

      setImageUrlInput('');
      showToast('Image URL added!', 'success');
    } catch (error) {
      showToast('Please enter a valid image URL', 'error');
    }
  };

  const handleAddressLookup = async () => {
    const address = formData.location?.address;
    if (!address) {
      showToast('Please enter an address first', 'error');
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Address not found');
      }

      console.log('Geocode result:', data);

      setFormData({
        ...formData,
        location: {
          address: data.displayName || address,
          lat: data.lat,
          lng: data.lng,
        },
      });
      showToast(`Coordinates found! Lat: ${data.lat}, Lng: ${data.lng}`, 'success');
    } catch (error) {
      console.error('Geocoding error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      showToast(`Could not find coordinates: ${errorMessage}`, 'error');
    } finally {
      setIsGeocoding(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading review...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </button>
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
          {editId ? 'Edit Review' : 'Add New Review'}
        </h1>
        <p className="text-gray-600">{editId ? 'Update restaurant review' : 'Create a new restaurant review'}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        {/* Basic Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Basic Information</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              required
              value={formData.restaurantName}
              onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Review Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Author *
            </label>
            <input
              type="text"
              required
              value={formData.author}
              onChange={(e) => setFormData({ ...formData, author: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Tanner Lee"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (0-10) *
            </label>
            <input
              type="number"
              required
              min="0"
              max="10"
              step="0.1"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Excerpt *
            </label>
            <textarea
              required
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Review Content *
            </label>
            <textarea
              required
              rows={10}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

        </div>

        {/* Images */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Images</h2>

          {/* Add Image URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Image URLs *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImageUrl();
                  }
                }}
                placeholder="https://i.imgur.com/example.jpg"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Add URL
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              ⚠️ Must be a direct image URL ending in .jpg, .png, .webp, etc. (Google Photos links won&apos;t work - upload to Imgur instead)
            </p>
            <p className="text-sm text-blue-600 mt-1">
              💡 Tip: Upload your images to <a href="https://imgur.com/upload" target="_blank" rel="noopener noreferrer" className="underline">Imgur</a>, then right-click the image and select &quot;Copy image address&quot;
            </p>
          </div>

          {/* Image Preview Grid */}
          {formData.images && formData.images.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                {formData.images.length} image(s) uploaded. Click &quot;Set Cover&quot; to choose your cover image.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images.map((url, index) => (
                  <div
                    key={index}
                    className={`relative group rounded-lg overflow-hidden transition-all ${
                      formData.coverImage === url
                        ? 'ring-4 ring-primary ring-offset-2 shadow-xl'
                        : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />

                    {/* Cover Badge */}
                    {formData.coverImage === url && (
                      <div className="absolute top-0 left-0 right-0 bg-primary text-white text-xs font-bold py-1 px-2 text-center">
                        ⭐ COVER IMAGE
                      </div>
                    )}

                    {/* Hover Controls */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                      {formData.coverImage !== url && (
                        <button
                          type="button"
                          onClick={() => setCoverImage(url)}
                          className="bg-primary text-white px-3 py-1 rounded text-sm font-semibold hover:bg-primary/90 transition-colors"
                        >
                          Set as Cover
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-1"
                      >
                        <X size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Location</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.location?.address}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location!, address: e.target.value }
                })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Enter restaurant address"
              />
              <button
                type="button"
                onClick={handleAddressLookup}
                disabled={isGeocoding}
                className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-400 flex items-center gap-2"
              >
                {isGeocoding ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Finding...
                  </>
                ) : (
                  'Find Coordinates'
                )}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Click &quot;Find Coordinates&quot; to automatically get the latitude and longitude
            </p>
          </div>

          {/* Coordinates Status */}
          {formData.location?.lat && formData.location?.lng &&
           formData.location.lat !== 0 && formData.location.lng !== 0 ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800">
                ✓ Coordinates found: {formData.location.lat}, {formData.location.lng}
              </p>
            </div>
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm font-semibold text-yellow-800">
                ⚠️ Coordinates not set yet. Please click &quot;Find Coordinates&quot; button above.
              </p>
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Tags</h2>

          {/* Cuisines */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cuisines</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput.cuisine}
                onChange={(e) => setTagInput({ ...tagInput, cuisine: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('cuisines', tagInput.cuisine);
                    setTagInput({ ...tagInput, cuisine: '' });
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add cuisine (press Enter)"
              />
              <button
                type="button"
                onClick={() => {
                  addTag('cuisines', tagInput.cuisine);
                  setTagInput({ ...tagInput, cuisine: '' });
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.cuisines?.map((cuisine, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-2"
                >
                  {cuisine}
                  <button
                    type="button"
                    onClick={() => removeTag('cuisines', index)}
                    className="text-primary hover:text-primary/70"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Vibes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vibes</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput.vibe}
                onChange={(e) => setTagInput({ ...tagInput, vibe: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('vibes', tagInput.vibe);
                    setTagInput({ ...tagInput, vibe: '' });
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add vibe (press Enter)"
              />
              <button
                type="button"
                onClick={() => {
                  addTag('vibes', tagInput.vibe);
                  setTagInput({ ...tagInput, vibe: '' });
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.vibes?.map((vibe, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary/30 text-gray-800 rounded-full text-sm flex items-center gap-2"
                >
                  {vibe}
                  <button
                    type="button"
                    onClick={() => removeTag('vibes', index)}
                    className="text-gray-800 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Food Types */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Food Types</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput.foodType}
                onChange={(e) => setTagInput({ ...tagInput, foodType: e.target.value })}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag('foodTypes', tagInput.foodType);
                    setTagInput({ ...tagInput, foodType: '' });
                  }
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Add food type (press Enter)"
              />
              <button
                type="button"
                onClick={() => {
                  addTag('foodTypes', tagInput.foodType);
                  setTagInput({ ...tagInput, foodType: '' });
                }}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags?.foodTypes?.map((type, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-accent text-gray-800 rounded-full text-sm flex items-center gap-2"
                >
                  {type}
                  <button
                    type="button"
                    onClick={() => removeTag('foodTypes', index)}
                    className="text-gray-800 hover:text-gray-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Favorite Dishes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Favorite Dishes</h2>

          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput.dish}
              onChange={(e) => setTagInput({ ...tagInput, dish: e.target.value })}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addDish(tagInput.dish);
                  setTagInput({ ...tagInput, dish: '' });
                }
              }}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Add favorite dish (press Enter)"
            />
            <button
              type="button"
              onClick={() => {
                addDish(tagInput.dish);
                setTagInput({ ...tagInput, dish: '' });
              }}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {formData.favoriteDishes?.map((dish, index) => (
              <li key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                <span>{dish}</span>
                <button
                  type="button"
                  onClick={() => removeDish(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
          >
            {editId ? 'Update Review' : 'Publish Review'}
          </button>
        </div>
      </form>
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

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>}>
      <AdminForm />
    </Suspense>
  );
}
