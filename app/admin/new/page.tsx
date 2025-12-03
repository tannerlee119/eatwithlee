'use client';

import { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Review } from '@/lib/types';
import { X, ArrowLeft, Loader2, GripVertical, Crop, Save, Eye, MapPin, Globe, Instagram, DollarSign, Tag, Image as ImageIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast';
import ImageCropper from '@/components/ImageCropper';
import { UploadDropzone } from '@/lib/uploadthing';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface ToastMessage {
  message: string;
  type: ToastType;
}

interface SortableImageProps {
  image: { url: string; caption: string };
  index: number;
  isCover: boolean;
  onSetCover: () => void;
  onRemove: () => void;
  onUpdateCaption: (caption: string) => void;
  onCrop: () => void;
}

function SortableImage({ image, index, isCover, onSetCover, onRemove, onUpdateCaption, onCrop }: SortableImageProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.url });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group rounded-xl border-2 transition-all overflow-hidden bg-white ${
        isCover ? 'border-primary shadow-md ring-2 ring-primary/20' : 'border-border hover:border-primary/50'
      }`}
    >
      <div className="aspect-[4/3] relative bg-accent">
        <img
          src={image.url}
          alt={image.caption || `Upload ${index + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="absolute top-2 left-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-lg cursor-move hover:bg-white text-secondary shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical size={16} />
        </div>

        {/* Cover Badge */}
        {isCover && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold py-1 px-2 rounded-full shadow-sm flex items-center gap-1">
            <CheckCircle2 size={12} />
            COVER
          </div>
        )}

        {/* Overlay Controls */}
        <div className="absolute inset-0 bg-secondary/80 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2 p-4">
          {!isCover && (
            <button
              type="button"
              onClick={onSetCover}
              className="w-full py-1.5 bg-white text-secondary text-xs font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Set as Cover
            </button>
          )}
          {isCover && (
            <button
              type="button"
              onClick={onCrop}
              className="w-full py-1.5 bg-blue-500 text-white text-xs font-semibold rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
            >
              <Crop size={12} />
              Crop Image
            </button>
          )}
          <button
            type="button"
            onClick={onRemove}
            className="w-full py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
          >
            <X size={12} />
            Remove
          </button>
        </div>
      </div>

      {/* Caption Input */}
      <div className="p-3 border-t border-border">
        <input
          type="text"
          value={image.caption}
          onChange={(e) => onUpdateCaption(e.target.value)}
          placeholder="Add a caption..."
          className="w-full text-xs border-none p-0 focus:ring-0 placeholder:text-muted text-secondary bg-transparent"
        />
      </div>
    </div>
  );
}

function AdminForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get('edit');

  const [formData, setFormData] = useState<Partial<Review>>({
    contentType: 'review',
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
    locationTag: '',
    website: '',
    instagram: '',
    yelp: '',
    priceRange: 2,
    tags: {
      cuisines: [],
      vibes: [],
      foodTypes: [],
    },
    favoriteDishes: [],
    leastFavoriteDishes: [],
    coverImage: '',
    images: [],
    author: 'Tanner Lee',
    publishedAt: new Date().toISOString().slice(0, 16),
  });

  const [tagInput, setTagInput] = useState({
    cuisine: '',
    vibe: '',
    foodType: '',
    dish: '',
    leastFavoriteDish: '',
  });

  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [cropperState, setCropperState] = useState<{ imageUrl: string; imageIndex: number } | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
            const loadedData = {
              ...review,
              tags: {
                cuisines: review.tags?.cuisines || [],
                vibes: review.tags?.vibes || [],
                foodTypes: review.tags?.foodTypes || [],
              }
            };
            setFormData(loadedData);
          }
        })
        .catch(error => {
          console.error('Error loading review:', error);
          showToast('Failed to load review for editing', 'error');
        })
        .finally(() => setIsLoading(false));
    } else {
      // Try to load draft from localStorage for new reviews
      const savedDraft = localStorage.getItem('review_draft');
      if (savedDraft) {
        try {
          const parsedDraft = JSON.parse(savedDraft);
          // Only restore if it's recent (e.g., last 24 hours)
          const draftTime = new Date(parsedDraft._savedAt).getTime();
          if (Date.now() - draftTime < 24 * 60 * 60 * 1000) {
            delete parsedDraft._savedAt;
            setFormData(prev => ({ ...prev, ...parsedDraft }));
            showToast('Restored unsaved draft', 'success');
          }
        } catch (e) {
          console.error('Failed to parse draft', e);
        }
      }
    }
  }, [editId]);

  // Auto-save functionality
  useEffect(() => {
    if (editId || isLoading) return; // Don't auto-save if editing existing review (for now) or loading

    const timeoutId = setTimeout(() => {
      if (formData.restaurantName || formData.title) {
        setIsAutoSaving(true);
        localStorage.setItem('review_draft', JSON.stringify({ ...formData, _savedAt: new Date().toISOString() }));
        setLastSaved(new Date());
        setTimeout(() => setIsAutoSaving(false), 500);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, editId, isLoading]);

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();

    if (!isDraft && (!formData.location?.lat || !formData.location?.lng)) {
      showToast('Please find coordinates for the restaurant address first', 'error');
      return;
    }

    if (!isDraft && (!formData.images || formData.images.length === 0)) {
      showToast('Please add at least one image for the review', 'error');
      return;
    }

    try {
      const url = editId ? `/api/reviews/${editId}` : '/api/reviews';
      const method = editId ? 'PATCH' : 'POST';
      const payload = { ...formData, isDraft };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || 'Failed to save review');
      }

      const savedReview = await response.json();
      
      // Clear local draft on successful save
      if (!editId) {
        localStorage.removeItem('review_draft');
      }

      const successMessage = editId
        ? (isDraft ? 'Draft saved successfully!' : 'Review updated successfully!')
        : (isDraft ? 'Draft saved successfully!' : 'Review published successfully!');

      if (editId || isDraft) {
        router.push(`/admin?message=${encodeURIComponent(successMessage)}`);
      } else {
        showToast(`Review published successfully! Slug: ${savedReview.slug}`, 'success');
        // Reset form...
        setFormData({
          contentType: 'review',
          title: '',
          restaurantName: '',
          excerpt: '',
          content: '',
          rating: 0,
          location: { address: '', lat: 0, lng: 0 },
          locationTag: '',
          website: '',
          instagram: '',
          yelp: '',
          priceRange: 2,
          tags: { cuisines: [], vibes: [], foodTypes: [] },
          favoriteDishes: [],
          leastFavoriteDishes: [],
          coverImage: '',
          images: [],
          author: 'Tanner Lee',
          publishedAt: new Date().toISOString().slice(0, 16),
        });
      }
    } catch (error) {
      console.error('Error saving review:', error);
      showToast('Failed to save review. Please try again.', 'error');
    }
  };

  // ... Tag/Dish helpers (same as before but cleaner) ...
  const addTag = (category: 'cuisines' | 'vibes' | 'foodTypes', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: { ...prev.tags!, [category]: [...(prev.tags![category] || []), value.trim()] }
      }));
    }
  };

  const removeTag = (category: 'cuisines' | 'vibes' | 'foodTypes', index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: { ...prev.tags!, [category]: prev.tags![category].filter((_, i) => i !== index) }
    }));
  };

  const addDish = (field: 'favoriteDishes' | 'leastFavoriteDishes', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...(prev[field] || []), value.trim()]
      }));
    }
  };

  const removeDish = (field: 'favoriteDishes' | 'leastFavoriteDishes', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field]?.filter((_, i) => i !== index)
    }));
  };

  const removeImage = (index: number) => {
    const newImages = formData.images?.filter((_, i) => i !== index) || [];
    setFormData(prev => ({
      ...prev,
      images: newImages,
      coverImage: prev.coverImage === prev.images?.[index]?.url ? (newImages[0]?.url || '') : prev.coverImage,
    }));
  };

  const setCoverImage = (url: string) => {
    setFormData(prev => ({ ...prev, coverImage: url }));
  };

  const updateImageCaption = (index: number, caption: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = { ...newImages[index], caption };
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleAddressLookup = async () => {
    if (!formData.location?.address) {
      showToast('Please enter an address first', 'error');
      return;
    }
    setIsGeocoding(true);
    try {
      const response = await fetch(`/api/geocode?address=${encodeURIComponent(formData.location.address)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Address not found');
      
      setFormData(prev => ({
        ...prev,
        location: { address: data.displayName || prev.location!.address, lat: data.lat, lng: data.lng }
      }));
      showToast(`Coordinates found!`, 'success');
    } catch (error) {
      showToast(`Could not find coordinates: ${error instanceof Error ? error.message : 'Unknown error'}`, 'error');
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = formData.images?.findIndex((img) => img.url === active.id) ?? -1;
      const newIndex = formData.images?.findIndex((img) => img.url === over.id) ?? -1;
      if (oldIndex !== -1 && newIndex !== -1) {
        setFormData(prev => ({ ...prev, images: arrayMove(prev.images || [], oldIndex, newIndex) }));
      }
    }
  };

  const handleCropImage = (imageIndex: number) => {
    const image = formData.images?.[imageIndex];
    if (image) setCropperState({ imageUrl: image.url, imageIndex });
  };

  const handleCropComplete = (cropData: { x: number; y: number; zoom: number }) => {
    setFormData(prev => ({ ...prev, coverImageCrop: cropData }));
    setCropperState(null);
    showToast('Crop settings saved!', 'success');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted font-medium">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-border sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="p-2 text-muted hover:text-secondary hover:bg-accent rounded-full transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-display font-bold text-secondary">
                {editId ? 'Edit Review' : 'New Review'}
              </h1>
              <div className="flex items-center gap-2 text-xs text-muted">
                {isAutoSaving ? (
                  <span className="flex items-center gap-1 text-primary">
                    <Loader2 size={10} className="animate-spin" /> Saving...
                  </span>
                ) : lastSaved ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={10} /> Saved {lastSaved.toLocaleTimeString()}
                  </span>
                ) : (
                  <span>Unsaved changes</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={(e) => handleSubmit(e, true)}
              className="px-4 py-2 text-sm font-medium text-secondary bg-accent hover:bg-accent/80 rounded-lg transition-colors"
            >
              Save Draft
            </button>
            <button
              onClick={(e) => handleSubmit(e, false)}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors flex items-center gap-2"
            >
              <Globe size={16} />
              Publish
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Info Card */}
            <section className="bg-white rounded-xl border border-border shadow-soft p-6 space-y-6">
              <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
                <Tag size={20} className="text-primary" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-1.5">Restaurant Name</label>
                  <input
                    type="text"
                    value={formData.restaurantName}
                    onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="e.g. The Pink Door"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-1.5">Review Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="Catchy title for the review"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Rating (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Price Range</label>
                  <div className="flex bg-surface border border-border rounded-lg p-1">
                    {[1, 2, 3, 4].map((price) => (
                      <button
                        key={price}
                        type="button"
                        onClick={() => setFormData({ ...formData, priceRange: price })}
                        className={`flex-1 py-1.5 rounded-md text-sm font-medium transition-all ${
                          formData.priceRange === price
                            ? 'bg-white text-primary shadow-sm'
                            : 'text-muted hover:text-secondary'
                        }`}
                      >
                        {Array(price).fill('$').join('')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-1.5">Excerpt</label>
                  <textarea
                    rows={2}
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                    placeholder="Brief summary for the card preview..."
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-1.5">Full Review Content</label>
                  <textarea
                    rows={12}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-serif text-lg leading-relaxed"
                    placeholder="Write your delicious review here..."
                  />
                </div>
              </div>
            </section>

            {/* Location Card */}
            <section className="bg-white rounded-xl border border-border shadow-soft p-6 space-y-6">
              <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
                <MapPin size={20} className="text-primary" />
                Location & Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-secondary mb-1.5">Address</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formData.location?.address}
                      onChange={(e) => setFormData({ ...formData, location: { ...formData.location!, address: e.target.value } })}
                      className="flex-1 px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Full address"
                    />
                    <button
                      type="button"
                      onClick={handleAddressLookup}
                      disabled={isGeocoding}
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 disabled:opacity-50 transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      {isGeocoding ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                      Find Coords
                    </button>
                  </div>
                  {formData.location?.lat !== 0 && (
                    <p className="mt-2 text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle2 size={12} />
                      Coordinates set: {formData.location?.lat.toFixed(4)}, {formData.location?.lng.toFixed(4)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Neighborhood Tag</label>
                  <input
                    type="text"
                    value={formData.locationTag}
                    onChange={(e) => setFormData({ ...formData, locationTag: e.target.value })}
                    className="w-full px-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    placeholder="e.g. Capitol Hill"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Website</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Instagram</label>
                  <div className="relative">
                    <Instagram size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="@eatwithlee"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary mb-1.5">Yelp</label>
                  <div className="relative">
                    <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                    <input
                      type="url"
                      value={formData.yelp}
                      onChange={(e) => setFormData({ ...formData, yelp: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 bg-surface border border-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="https://www.yelp.com/biz/..."
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Images & Meta */}
          <div className="space-y-8">
            {/* Images Card */}
            <section className="bg-white rounded-xl border border-border shadow-soft p-6 space-y-6">
              <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
                <ImageIcon size={20} className="text-primary" />
                Gallery
              </h2>

              <div className="space-y-4">
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res) {
                      const newImages = res.map(file => ({ url: file.url, caption: '' }));
                      setFormData(prev => ({
                        ...prev,
                        images: [...(prev.images || []), ...newImages],
                        coverImage: prev.coverImage || newImages[0].url
                      }));
                      showToast(`${newImages.length} images uploaded!`, 'success');
                    }
                  }}
                  onUploadError={(error: Error) => {
                    showToast(`Upload failed: ${error.message}`, 'error');
                  }}
                  appearance={{
                    button: "bg-primary text-primary-foreground hover:bg-primary/90",
                    container: "border-2 border-dashed border-border bg-surface hover:bg-accent transition-colors rounded-xl",
                    label: "text-primary hover:text-primary/80",
                  }}
                />

                {formData.images && formData.images.length > 0 && (
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                  >
                    <SortableContext
                      items={formData.images.map(img => img.url)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="grid grid-cols-2 gap-3">
                        {formData.images.map((image, index) => (
                          <SortableImage
                            key={image.url}
                            image={image}
                            index={index}
                            isCover={formData.coverImage === image.url}
                            onSetCover={() => setCoverImage(image.url)}
                            onRemove={() => removeImage(index)}
                            onUpdateCaption={(caption) => updateImageCaption(index, caption)}
                            onCrop={() => handleCropImage(index)}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </DndContext>
                )}
              </div>
            </section>

            {/* Tags Card */}
            <section className="bg-white rounded-xl border border-border shadow-soft p-6 space-y-6">
              <h2 className="text-lg font-semibold text-secondary flex items-center gap-2">
                <Tag size={20} className="text-primary" />
                Tags & Categories
              </h2>

              {/* Cuisines */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Cuisines</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput.cuisine}
                    onChange={(e) => setTagInput({ ...tagInput, cuisine: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (addTag('cuisines', tagInput.cuisine), setTagInput({ ...tagInput, cuisine: '' }))}
                    className="flex-1 px-3 py-1.5 text-sm bg-surface border border-border rounded-md"
                    placeholder="Add cuisine..."
                  />
                  <button
                    type="button"
                    onClick={() => (addTag('cuisines', tagInput.cuisine), setTagInput({ ...tagInput, cuisine: '' }))}
                    className="px-3 py-1.5 bg-secondary text-white rounded-md text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags?.cuisines?.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-orange-50 text-orange-700 rounded text-xs font-medium flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag('cuisines', i)} className="hover:text-orange-900">×</button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Vibes */}
              <div>
                <label className="block text-xs font-semibold text-muted uppercase tracking-wider mb-2">Vibes</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tagInput.vibe}
                    onChange={(e) => setTagInput({ ...tagInput, vibe: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (addTag('vibes', tagInput.vibe), setTagInput({ ...tagInput, vibe: '' }))}
                    className="flex-1 px-3 py-1.5 text-sm bg-surface border border-border rounded-md"
                    placeholder="Add vibe..."
                  />
                  <button
                    type="button"
                    onClick={() => (addTag('vibes', tagInput.vibe), setTagInput({ ...tagInput, vibe: '' }))}
                    className="px-3 py-1.5 bg-secondary text-white rounded-md text-sm"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.tags?.vibes?.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium flex items-center gap-1">
                      {tag}
                      <button onClick={() => removeTag('vibes', i)} className="hover:text-purple-900">×</button>
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {cropperState && (
        <ImageCropper
          imageUrl={cropperState.imageUrl}
          initialCrop={formData.coverImageCrop}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropperState(null)}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>}>
      <AdminForm />
    </Suspense>
  );
}
