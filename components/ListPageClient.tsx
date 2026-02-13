'use client';

import { useRef, useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';

// Dynamically import map to avoid SSR issues with Leaflet
const ListMapClient = dynamic(() => import('@/components/ListMapClient'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full rounded-2xl bg-slate-100 animate-pulse flex items-center justify-center">
            <span className="text-slate-400 text-sm">Loading map…</span>
        </div>
    ),
});

interface ListItem {
    id: string;
    blurb: string;
    review: {
        id: string;
        restaurantName: string;
        slug: string;
        excerpt: string;
        coverImage: string;
        rating: number;
        priceRange: number;
        locationTag: string;
        address: string;
        lat: number;
        lng: number;
    };
}

interface ListPageClientProps {
    items: ListItem[];
}

export default function ListPageClient({ items }: ListPageClientProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const entryRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        entryRefs.current.forEach((ref, index) => {
            if (!ref) return;
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveIndex(index);
                        }
                    });
                },
                {
                    rootMargin: '-30% 0px -60% 0px',
                    threshold: 0,
                }
            );
            observer.observe(ref);
            observers.push(observer);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, [items]);

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

    const mapEntries = items.map((item, i) => ({
        lat: item.review.lat,
        lng: item.review.lng,
        label: i < 9 ? String(i + 1) : String.fromCharCode(65 + i - 9),
        name: item.review.restaurantName,
    }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left: Scrollable entries */}
            <div className="lg:pr-8">
                {items.map((item, index) => {
                    const imgSrc = normalizeImageSrc(item.review.coverImage || '');
                    const blurb = (item.blurb || '').trim();
                    const address = (item.review.address || '').trim();
                    const mapLabel = index < 9 ? String(index + 1) : String.fromCharCode(65 + index - 9);

                    return (
                        <div
                            key={item.id}
                            ref={(el) => { entryRefs.current[index] = el; }}
                            className={`border-b border-slate-100 py-10 first:pt-0 transition-opacity duration-300 ${activeIndex === index ? 'opacity-100' : 'lg:opacity-60'
                                }`}
                            style={{
                                animation: `fadeInUp 0.6s ease-out ${0.2 + index * 0.06}s both`,
                            }}
                        >
                            {/* Number + Name */}
                            <div className="flex items-start gap-4 mb-5">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center text-sm font-bold">
                                    {mapLabel}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight leading-[1.05]">
                                        {item.review.restaurantName}
                                    </h2>
                                </div>
                            </div>

                            {/* Address */}
                            {address && (
                                <div className="flex items-start gap-2 text-sm text-slate-500 mb-5 ml-14">
                                    <MapPin size={14} className="mt-0.5 shrink-0" />
                                    <span>{address}</span>
                                </div>
                            )}

                            {/* Image */}
                            {imgSrc && (
                                <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-slate-100 relative mb-5 ml-14">
                                    {shouldUseNextImage(imgSrc) ? (
                                        <Image
                                            src={imgSrc}
                                            alt={item.review.restaurantName}
                                            fill
                                            sizes="(min-width: 1024px) 50vw, 100vw"
                                            className="object-cover"
                                            quality={80}
                                        />
                                    ) : (
                                        <img
                                            src={imgSrc}
                                            alt={item.review.restaurantName}
                                            loading={index < 3 ? 'eager' : 'lazy'}
                                            decoding="async"
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    )}
                                </div>
                            )}

                            {/* Blurb */}
                            {blurb && (
                                <p className="text-lg text-slate-700 leading-relaxed mb-5 ml-14">{blurb}</p>
                            )}

                            {/* Read Review */}
                            <div className="ml-14">
                                <Link
                                    href={`/reviews/${item.review.slug}`}
                                    className="inline-flex items-center gap-2 text-sm font-bold text-slate-900 uppercase tracking-wider hover:text-slate-600 transition-colors"
                                >
                                    Read Review →
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Right: Sticky map */}
            <div className="hidden lg:block">
                <div className="sticky top-0 h-screen py-6">
                    <ListMapClient entries={mapEntries} activeIndex={activeIndex} />
                </div>
            </div>
        </div>
    );
}
