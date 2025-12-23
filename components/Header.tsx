import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center">
        <Link href="/" className="inline-block">
          <span className="block text-5xl md:text-7xl font-display font-bold tracking-tight text-gray-900">
            EAT WITH LEE
          </span>
        </Link>

        <nav className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-gray-600 uppercase tracking-[0.18em]">
          <Link href="/" className="hover:text-gray-900 transition-colors">
            Reviews
          </Link>
          <Link href="/loved-list" className="hover:text-gray-900 transition-colors">
            Loved List
          </Link>
          <Link href="/lists" className="hover:text-gray-900 transition-colors">
            Lists
          </Link>
          <Link href="/stats" className="hover:text-gray-900 transition-colors">
            Stats
          </Link>
        </nav>
      </div>
    </header>
  );
}
