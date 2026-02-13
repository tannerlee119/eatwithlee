import { getListBySlug } from '@/lib/db-lists';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';
import ListPageClient from '@/components/ListPageClient';

export const revalidate = 0;

export default async function ListPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const list = await getListBySlug(slug);

    if (!list || list.isDraft) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Link
                    href="/reviews"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-10 transition-all duration-300 hover:-translate-x-1 group text-sm"
                >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium tracking-wide uppercase">Back</span>
                </Link>

                <h1
                    className="text-5xl md:text-7xl font-display font-bold text-slate-900 tracking-tight leading-[0.95]"
                    style={{ animation: 'fadeInUp 0.6s ease-out both' }}
                >
                    {list.title}
                </h1>
                {list.description && (
                    <p
                        className="mt-6 text-xl md:text-2xl text-slate-600 leading-relaxed font-light max-w-2xl"
                        style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
                    >
                        {list.description}
                    </p>
                )}
                <div
                    className="mt-4 text-sm text-slate-400 font-medium uppercase tracking-widest"
                    style={{ animation: 'fadeInUp 0.6s ease-out 0.15s both' }}
                >
                    {list.items.length} {list.items.length === 1 ? 'spot' : 'spots'} ·{' '}
                    {new Date(list.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        year: 'numeric',
                    })}
                </div>
            </div>

            {/* Entries + Map */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {list.items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-600 text-lg">No entries in this list yet.</p>
                    </div>
                ) : (
                    <ListPageClient items={list.items} headerBlurb={list.description} />
                )}
            </div>
        </div>
    );
}
