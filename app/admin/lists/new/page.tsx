'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
    ArrowLeft,
    Plus,
    Trash2,
    GripVertical,
    Search,
    X,
    Save,
    Globe,
} from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast';

interface ReviewOption {
    id: string;
    restaurantName: string;
    slug: string;
    coverImage: string;
    rating: number;
    locationTag: string;
}

interface ListItemData {
    id?: string;
    reviewId: string;
    blurb: string;
    position: number;
    review: ReviewOption;
}

interface ListFormData {
    title: string;
    slug: string;
    description: string;
    isDraft: boolean;
    publishedAt: string;
}

function EditListContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const editId = searchParams.get('edit');
    const isEditing = Boolean(editId);

    const [form, setForm] = useState<ListFormData>({
        title: '',
        slug: '',
        description: '',
        isDraft: true,
        publishedAt: new Date().toISOString().split('T')[0],
    });
    const [items, setItems] = useState<ListItemData[]>([]);
    const [allReviews, setAllReviews] = useState<ReviewOption[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [dragIdx, setDragIdx] = useState<number | null>(null);

    // Load reviews for picker
    useEffect(() => {
        fetch('/api/reviews')
            .then((res) => res.json())
            .then((data) => {
                const published = data
                    .filter((r: any) => !r.isDraft && r.contentType === 'review')
                    .map((r: any) => ({
                        id: r.id,
                        restaurantName: r.restaurantName,
                        slug: r.slug,
                        coverImage: r.coverImage,
                        rating: r.rating,
                        locationTag: r.locationTag || r.location?.address || '',
                    }));
                setAllReviews(published);
            })
            .catch(() => setToast({ message: 'Failed to load reviews', type: 'error' }));
    }, []);

    // Load existing list when editing
    useEffect(() => {
        if (!editId) {
            setIsLoading(false);
            return;
        }

        fetch(`/api/lists/${editId}`)
            .then((res) => res.json())
            .then((data) => {
                setForm({
                    title: data.title,
                    slug: data.slug,
                    description: data.description || '',
                    isDraft: data.isDraft,
                    publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                });
                setItems(
                    (data.items || []).map((item: any) => ({
                        id: item.id,
                        reviewId: item.reviewId,
                        blurb: item.blurb || '',
                        position: item.position,
                        review: {
                            id: item.review.id,
                            restaurantName: item.review.restaurantName,
                            slug: item.review.slug,
                            coverImage: item.review.coverImage,
                            rating: item.review.rating,
                            locationTag: item.review.locationTag || item.review.address || '',
                        },
                    }))
                );
            })
            .catch(() => setToast({ message: 'Failed to load list', type: 'error' }))
            .finally(() => setIsLoading(false));
    }, [editId]);

    const generateSlug = (title: string) =>
        title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

    const handleTitleChange = (title: string) => {
        setForm((f) => ({
            ...f,
            title,
            slug: isEditing ? f.slug : generateSlug(title),
        }));
    };

    const addReview = (review: ReviewOption) => {
        if (items.some((i) => i.reviewId === review.id)) {
            setToast({ message: 'Review already in list', type: 'error' });
            return;
        }
        setItems((prev) => [
            ...prev,
            {
                reviewId: review.id,
                blurb: '',
                position: prev.length,
                review,
            },
        ]);
        setShowPicker(false);
        setSearchQuery('');
    };

    const removeItem = (index: number) => {
        setItems((prev) => prev.filter((_, i) => i !== index));
    };

    const updateBlurb = (index: number, blurb: string) => {
        setItems((prev) => prev.map((item, i) => (i === index ? { ...item, blurb } : item)));
    };

    const moveItem = (from: number, to: number) => {
        if (to < 0 || to >= items.length) return;
        setItems((prev) => {
            const newItems = [...prev];
            const [moved] = newItems.splice(from, 1);
            newItems.splice(to, 0, moved);
            return newItems.map((item, i) => ({ ...item, position: i }));
        });
    };

    const handleDragStart = (index: number) => {
        setDragIdx(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (dragIdx !== null && dragIdx !== index) {
            moveItem(dragIdx, index);
            setDragIdx(index);
        }
    };

    const handleDragEnd = () => {
        setDragIdx(null);
    };

    const handleSave = async (publish: boolean) => {
        if (!form.title.trim() || !form.slug.trim()) {
            setToast({ message: 'Title and slug are required', type: 'error' });
            return;
        }

        setIsSaving(true);

        try {
            const isDraft = publish ? false : form.isDraft;

            if (isEditing) {
                // Update list metadata
                const res = await fetch(`/api/lists/${editId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...form, isDraft, publishedAt: new Date(form.publishedAt).toISOString() }),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Failed to update list');
                }

                // Sync items: delete existing, re-add in order
                // First, get current items to delete
                const listData = await res.json();
                for (const existingItem of listData.items || []) {
                    await fetch(`/api/lists/${editId}/items?itemId=${existingItem.id}`, {
                        method: 'DELETE',
                    });
                }

                // Add items in order
                for (let i = 0; i < items.length; i++) {
                    await fetch(`/api/lists/${editId}/items`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            reviewId: items[i].reviewId,
                            blurb: items[i].blurb,
                        }),
                    });
                }
            } else {
                // Create list
                const res = await fetch('/api/lists', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...form, isDraft, publishedAt: new Date(form.publishedAt).toISOString() }),
                });
                if (!res.ok) {
                    const err = await res.json();
                    throw new Error(err.error || 'Failed to create list');
                }
                const newList = await res.json();

                // Add items
                for (let i = 0; i < items.length; i++) {
                    await fetch(`/api/lists/${newList.id}/items`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            reviewId: items[i].reviewId,
                            blurb: items[i].blurb,
                        }),
                    });
                }
            }

            router.push('/admin/lists?message=List saved successfully');
        } catch (error: any) {
            setToast({ message: error.message || 'Failed to save list', type: 'error' });
        } finally {
            setIsSaving(false);
        }
    };

    const filteredReviews = allReviews.filter(
        (r) =>
            r.restaurantName.toLowerCase().includes(searchQuery.toLowerCase()) &&
            !items.some((i) => i.reviewId === r.id)
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="animate-pulse text-muted font-medium">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface pb-20">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin/lists"
                                className="p-2 text-muted hover:text-secondary hover:bg-accent rounded-lg transition-colors"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl font-display font-bold text-secondary">
                                {isEditing ? 'Edit List' : 'New List'}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleSave(false)}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-secondary bg-accent hover:bg-accent/80 rounded-lg transition-colors disabled:opacity-50"
                            >
                                <Save size={16} />
                                Save Draft
                            </button>
                            <button
                                onClick={() => handleSave(true)}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                            >
                                <Globe size={16} />
                                {isEditing ? 'Update' : 'Publish'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* List Details */}
                <div className="bg-white rounded-xl border border-border p-6 space-y-4">
                    <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">
                        List Details
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            placeholder="e.g. Top Eats of 2025"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Slug</label>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-muted">/lists/</span>
                            <input
                                type="text"
                                value={form.slug}
                                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                                className="flex-1 px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                placeholder="top-eats-2025"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Description</label>
                        <textarea
                            value={form.description}
                            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                            rows={2}
                            placeholder="A brief description of this list"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-secondary mb-1">Published Date</label>
                        <input
                            type="date"
                            value={form.publishedAt}
                            onChange={(e) => setForm((f) => ({ ...f, publishedAt: e.target.value }))}
                            className="w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* List Entries */}
                <div className="bg-white rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-sm font-semibold text-muted uppercase tracking-wider">
                            Entries ({items.length})
                        </h2>
                        <button
                            onClick={() => setShowPicker(true)}
                            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
                        >
                            <Plus size={16} />
                            Add Review
                        </button>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-border rounded-xl">
                            <p className="text-muted mb-3">No entries yet</p>
                            <button
                                onClick={() => setShowPicker(true)}
                                className="text-primary text-sm font-medium hover:underline"
                            >
                                Add a review to this list
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div
                                    key={item.reviewId}
                                    draggable
                                    onDragStart={() => handleDragStart(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className={`border border-border rounded-xl p-4 transition-all ${dragIdx === index ? 'opacity-50 bg-accent' : 'bg-white hover:shadow-sm'
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        {/* Drag handle + number */}
                                        <div className="flex items-center gap-2 pt-1 shrink-0">
                                            <GripVertical
                                                size={16}
                                                className="text-muted cursor-grab active:cursor-grabbing"
                                            />
                                            <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold">
                                                {index + 1}
                                            </div>
                                        </div>

                                        {/* Cover image */}
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-accent shrink-0">
                                            {item.review.coverImage ? (
                                                <img
                                                    src={item.review.coverImage}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100" />
                                            )}
                                        </div>

                                        {/* Info + blurb */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="font-medium text-secondary text-sm">
                                                        {item.review.restaurantName}
                                                    </div>
                                                    <div className="text-xs text-muted">
                                                        {item.review.locationTag} · {item.review.rating}/10
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => removeItem(index)}
                                                    className="p-1.5 text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                                                    title="Remove"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>

                                            <textarea
                                                value={item.blurb}
                                                onChange={(e) => updateBlurb(index, e.target.value)}
                                                className="mt-2 w-full px-3 py-2 text-sm border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none"
                                                rows={2}
                                                placeholder="Write a custom blurb for this entry..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Picker Modal */}
            {showPicker && (
                <div className="fixed inset-0 bg-secondary/20 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-20">
                    <div className="bg-white rounded-xl w-full max-w-lg shadow-xl border border-border max-h-[70vh] flex flex-col">
                        <div className="p-4 border-b border-border flex items-center gap-3">
                            <Search size={16} className="text-muted" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-sm focus:outline-none"
                                placeholder="Search reviews..."
                                autoFocus
                            />
                            <button
                                onClick={() => {
                                    setShowPicker(false);
                                    setSearchQuery('');
                                }}
                                className="p-1 text-muted hover:text-secondary rounded"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="overflow-y-auto flex-1 p-2">
                            {filteredReviews.length === 0 ? (
                                <p className="text-center text-muted text-sm py-8">No matching reviews</p>
                            ) : (
                                filteredReviews.map((review) => (
                                    <button
                                        key={review.id}
                                        onClick={() => addReview(review)}
                                        className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors text-left"
                                    >
                                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-accent shrink-0">
                                            {review.coverImage ? (
                                                <img
                                                    src={review.coverImage}
                                                    alt=""
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100" />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="font-medium text-secondary text-sm truncate">
                                                {review.restaurantName}
                                            </div>
                                            <div className="text-xs text-muted">
                                                {review.locationTag} · {review.rating}/10
                                            </div>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default function NewListPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-surface flex items-center justify-center">
                    <div className="animate-pulse text-muted">Loading...</div>
                </div>
            }
        >
            <EditListContent />
        </Suspense>
    );
}
