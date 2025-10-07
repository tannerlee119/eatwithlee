'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';
import { Upload, X, Loader2 } from 'lucide-react';

export default function AdminPage() {
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

  const [isUploading, setIsUploading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that coordinates have been set
    if (!formData.location?.lat || !formData.location?.lng ||
        formData.location.lat === 0 || formData.location.lng === 0) {
      alert('⚠️ Please find coordinates for the restaurant address first!\n\nClick the "Find Coordinates" button next to the address field.');
      return;
    }

    // Validate that at least one image is uploaded
    if (!formData.images || formData.images.length === 0) {
      alert('⚠️ Please upload at least one image for the review.');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to save review');
      }

      const savedReview = await response.json();
      alert(`✓ Review saved successfully!\n\nSlug: ${savedReview.slug}\nYou can view it at: /reviews/${savedReview.slug}`);

      // Reset form
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
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Failed to save review. Please try again.');
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      console.log('Starting upload of', files.length, 'files...');

      const uploadFormData = new FormData();
      Array.from(files).forEach(file => {
        uploadFormData.append('files', file);
      });

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      console.log('Upload response:', data);

      const urls = data.urls;
      const newImages = [...(formData.images || []), ...urls];
      const newCoverImage = formData.coverImage || urls[0];

      setFormData({
        ...formData,
        images: newImages,
        coverImage: newCoverImage,
      });

      alert(`✓ Successfully uploaded ${urls.length} image(s)!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload images: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
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

  const handleAddressLookup = async () => {
    const address = formData.location?.address;
    if (!address) {
      alert('Please enter an address first');
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
      alert(`✓ Coordinates found!\nLat: ${data.lat}\nLng: ${data.lng}`);
    } catch (error) {
      console.error('Geocoding error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Could not find coordinates:\n${errorMessage}\n\nTip: Try adding city/state to the address (e.g., "123 Main St, Los Angeles, CA")`);
    } finally {
      setIsGeocoding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600">Add a new restaurant review</p>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Images
            </label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer">
                {isUploading ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Choose Images
                  </>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>
              <span className="text-sm text-gray-500">
                Upload up to 10 images (max 4MB each)
              </span>
            </div>
          </div>

          {/* Image Preview Grid */}
          {formData.images && formData.images.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                {formData.images.length} image(s) uploaded. Click "Set Cover" to choose your cover image.
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
              Click "Find Coordinates" to automatically get the latitude and longitude
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
                ⚠️ Coordinates not set yet. Please click "Find Coordinates" button above.
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
            Publish Review
          </button>
        </div>
      </form>
    </div>
  );
}
