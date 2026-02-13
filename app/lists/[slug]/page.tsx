import { getListBySlug } from '@/lib/db-lists';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, ArrowLeft } from 'lucide-react';
import { notFound } from 'next/navigation';

export const revalidate = 0;

export default async function ListPage({ params }: { params: { slug: string } }) {
    const list = await getListBySlug(params.slug);

    if (!list || list.isDraft) {
        notFound();
    }

    const normalizeImageSrc = (src: string): string | null => {
        const trimmed = (src || '').trim();
        if (!trimmed) return null;
        if (trimmed.startsWith('/')) return trimmed;
        if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
            return `/${trimmed}`;
        }
        try {
            new URL(trimmed);
            return trimmed;
        } catch {
            return null;
        }
    };

    const shouldUseNextImage = (src: string): boolean => {
        if (src.startsWith('/')) return true;
        try {
            const u = new URL(src);
            return ['utfs.io', 'uploadthing.com', 'files.uploadthing.com'].includes(u.hostname);
        } catch {
            return false;
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
                <Link
                    href="/lists"
                    className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-10 transition-all duration-300 hover:-translate-x-1 group text-sm"
                >
                    <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                    <span className="font-medium tracking-wide uppercase">All Lists</span>
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

            {/* Entries */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                {list.items.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-slate-600 text-lg">No entries in this list yet.</p>
                    </div>
                ) : (
                    <div className="space-y-0">
                        {list.items.map((item, index) => {
                            const imgSrc = normalizeImageSrc(item.review.coverImage || '');
                            const locationLabel = (item.review.locationTag || item.review.address || '').trim();
                            const blurb = (item.blurb || '').trim();
                            const mapLabel =
                                index < 9 ? String(index + 1) : String.fromCharCode(65 + index - 9);

                            return (
                                <div
                                    key={item.id}
                                    className="border-b border-slate-100 py-10 first:pt-0"
                                    style={{
                                        animation: `fadeInUp 0.6s ease-out ${0.2 + index * 0.06}s both`,
                                    }}
                                >
                                    {/* Number + Name header */}
                                    <div className="flex items-start gap-4 mb-6">
                                        <div className="shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                                            {mapLabel}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <Link href={`/reviews/${item.review.slug}`}>
                                                <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight leading-[1.05] hover:text-slate-700 transition-colors">
                                                    {item.review.restaurantName}
                                                </h2>
                                            </Link>
                                            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                                                {locationLabel && (
                                                    <span className="flex items-center gap-1.5">
                                                        <MapPin size={14} />
                                                        {locationLabel}
                                                    </span>
                                                )}
                                                <span className="font-medium text-slate-700">
                                                    {'$'.repeat(item.review.priceRange)}
                                                </span>
                                                <span className="flex items-center gap-1 font-bold text-slate-900">
                                                    <Star size={13} fill="currentColor" />
                                                    {item.review.rating}/10
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image */}
                                    {imgSrc && (
                                        <Link href={`/reviews/${item.review.slug}`} className="block mb-6">
                                            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 relative group">
                                                {shouldUseNextImage(imgSrc) ? (
                                                    <Image
                                                        src={imgSrc}
                                                        alt={item.review.restaurantName}
                                                        fill
                                                        sizes="(min-width: 768px) 768px, 100vw"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        quality={80}
                                                    />
                                                ) : (
                                                    <img
                                                        src={imgSrc}
                                                        alt={item.review.restaurantName}
                                                        loading={index < 3 ? 'eager' : 'lazy'}
                                                        decoding="async"
                                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                )}
                                            </div>
                                        </Link>
                                    )}

                                    {/* Custom blurb */}
                                    {blurb && (
                                        <p className="text-lg text-slate-700 leading-relaxed mb-6">{blurb}</p>
                                    )}

                                    {/* Read Review link */}
                                    <Link
                                        href={`/reviews/${item.review.slug}`}
                                        className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-slate-600 transition-colors"
                                    >
                                        Read Review →
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
