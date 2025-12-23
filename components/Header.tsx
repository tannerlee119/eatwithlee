import Link from 'next/link';
import StickyNav from '@/components/StickyNav';
import MobileNav from '@/components/MobileNav';

export default function Header() {
  const navItems = [
    { href: '/reviews', label: 'Reviews' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/bars', label: 'Bars' },
    { href: '/cafes', label: 'Cafes' },
    { href: '/lists', label: 'Lists' },
    { href: '/loved-list', label: 'Loved List' },
    { href: '/stats', label: 'Stats' },
  ];

  return (
    <header className="border-b border-gray-100 bg-white">
      {/* Desktop-only sticky nav (mobile uses dropdown, non-sticky) */}
      <div className="hidden md:block">
        <StickyNav items={navItems} />
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <Link href="/reviews" className="inline-block">
          <span className="block text-5xl md:text-7xl font-display font-bold tracking-tight text-gray-900">
            EAT WITH LEE
          </span>
        </Link>

        {/* Mobile dropdown menu (non-sticky) */}
        <div className="mt-6 md:hidden flex justify-center">
          <MobileNav items={navItems} />
        </div>

        {/* Desktop nav bar */}
        <nav className="mt-6 hidden md:block">
          <div className="inline-flex flex-wrap justify-center gap-x-8 gap-y-2 rounded-xl border border-slate-200 bg-white px-6 py-3 shadow-sm text-sm font-semibold text-gray-600 uppercase tracking-[0.18em]">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="hover:text-gray-900 transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
