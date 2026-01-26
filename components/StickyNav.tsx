'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

type NavItem = { href: string; label: string };

export default function StickyNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShow(window.scrollY > 160);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={[
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out',
        show ? 'translate-y-0 opacity-100' : '-translate-y-6 opacity-0 pointer-events-none',
      ].join(' ')}
    >
      <div className="bg-white/90 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-center">
          <div className="inline-flex flex-wrap justify-center gap-x-8 gap-y-2 rounded-xl border border-slate-200 bg-white px-6 py-3 shadow-sm text-xs font-semibold text-gray-600 uppercase tracking-[0.18em]">
            {items.map((item) => {
              const active =
                pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    'transition-colors hover:text-gray-900',
                    active ? 'text-gray-900' : 'text-gray-600',
                  ].join(' ')}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}


