'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Toast, { ToastType } from '@/components/Toast';

interface ListSummary {
    id: string;
    title: string;
    slug: string;
    description: string;
    isDraft: boolean;
    publishedAt: string;
    items: { id: string }[];
}

export default function AdminListsPage() {
    const [lists, setLists] = useState<ListSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);

    const loadLists = async () => {
        try {
            const res = await fetch('/api/lists');
            const data = await res.json();
            setLists(data);
        } catch (error) {
            console.error('Error loading lists:', error);
            setToast({ message: 'Failed to load lists', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadLists();
    }, []);

    const confirmDelete = async () => {
        if (!deleteConfirm) return;
        try {
            const res = await fetch(`/api/lists/${deleteConfirm.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error();
            setToast({ message: 'List deleted', type: 'success' });
            loadLists();
            setDeleteConfirm(null);
        } catch {
            setToast({ message: 'Failed to delete list', type: 'error' });
        }
    };

    const formatDate = (dateString: string) =>
        new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-surface flex items-center justify-center">
                <div className="animate-pulse text-muted font-medium">Loading lists...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-surface pb-20">
            {/* Header */}
            <div className="bg-white border-b border-border sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/admin"
                                className="p-2 text-muted hover:text-secondary hover:bg-accent rounded-lg transition-colors"
                            >
                                <ArrowLeft size={18} />
                            </Link>
                            <h1 className="text-xl font-display font-bold text-secondary">Lists</h1>
                        </div>
                        <Link
                            href="/admin/lists/new"
                            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow-md"
                        >
                            <Plus size={18} />
                            New List
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {lists.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl border border-border border-dashed">
                        <h3 className="text-lg font-medium text-secondary mb-1">No lists yet</h3>
                        <p className="text-muted mb-6">Create your first curated list.</p>
                        <Link
                            href="/admin/lists/new"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            <Plus size={18} />
                            Create List
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-border shadow-card overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-surface border-b border-border">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                        List
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                        Entries
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-muted uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {lists.map((list) => (
                                    <tr key={list.id} className="group hover:bg-surface/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-secondary">{list.title}</div>
                                            <div className="text-xs text-muted">/lists/{list.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-secondary">
                                            {list.items.length} {list.items.length === 1 ? 'entry' : 'entries'}
                                        </td>
                                        <td className="px-6 py-4">
                                            {list.isDraft ? (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-700 text-xs font-medium">
                                                    <EyeOff size={12} />
                                                    Draft
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-xs font-medium">
                                                    <Eye size={12} />
                                                    Published
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-muted">{formatDate(list.publishedAt)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/lists/${list.slug}`}
                                                    className="p-2 text-muted hover:text-primary hover:bg-orange-50 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <Link
                                                    href={`/admin/lists/new?edit=${list.id}`}
                                                    className="p-2 text-muted hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => setDeleteConfirm({ id: list.id, title: list.title })}
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
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-secondary/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl border border-border">
                        <h3 className="text-lg font-semibold text-secondary mb-2">Delete List?</h3>
                        <p className="text-muted mb-6">
                            Are you sure you want to delete <strong>{deleteConfirm.title}</strong>? This action
                            cannot be undone.
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
                                Delete List
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}
