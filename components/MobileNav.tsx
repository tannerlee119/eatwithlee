'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

type NavItem = { href: string; label: string };

export default function MobileNav({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!open) return;
      const target = e.target as Node;
      if (panelRef.current && !panelRef.current.contains(target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  return (
    <div ref={panelRef} className="relative w-full max-w-sm">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full inline-flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm text-sm font-semibold text-gray-700 uppercase tracking-[0.18em]"
        aria-expanded={open}
        aria-label="Toggle navigation menu"
      >
        <span>Menu</span>
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <div
        className={[
          'absolute left-0 right-0 mt-2 origin-top rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden transition-all duration-200 ease-out',
          open ? 'scale-y-100 opacity-100' : 'scale-y-95 opacity-0 pointer-events-none',
        ].join(' ')}
      >
        <div className="py-2">
          {items.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={[
                  'block px-4 py-3 text-base font-extrabold tracking-wide uppercase transition-colors',
                  active ? 'text-gray-900' : 'text-gray-800 hover:text-gray-900',
                ].join(' ')}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}


