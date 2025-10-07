'use client';

import { useState } from 'react';
import { Review } from '@/lib/types';

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
    author: 'Lee',
  });

  const [tagInput, setTagInput] = useState({
    cuisine: '',
    vibe: '',
    foodType: '',
    dish: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
      alert(`Review saved successfully! Slug: ${savedReview.slug}`);

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
        author: 'Lee',
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Image URL *
            </label>
            <input
              type="text"
              required
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-4">
          <h2 className="text-2xl font-display font-semibold text-gray-900">Location</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              value={formData.location?.address}
              onChange={(e) => setFormData({
                ...formData,
                location: { ...formData.location!, address: e.target.value }
              })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude *
              </label>
              <input
                type="number"
                required
                step="any"
                value={formData.location?.lat}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location!, lat: parseFloat(e.target.value) }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude *
              </label>
              <input
                type="number"
                required
                step="any"
                value={formData.location?.lng}
                onChange={(e) => setFormData({
                  ...formData,
                  location: { ...formData.location!, lng: parseFloat(e.target.value) }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
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
