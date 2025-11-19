import Link from 'next/link';

export default function Header() {
  return (
    <header className="border-b border-gray-100 bg-white/80 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
        <div>
          <Link href="/" className="inline-flex items-baseline gap-2">
            <span className="text-2xl md:text-3xl font-display font-bold tracking-tight text-gray-900">
              Eat with Lee
            </span>
            <span className="hidden md:inline text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              {/* Restaurant Reviews */}
            </span>
          </Link>
          <p className="mt-1 text-sm text-gray-500">
            {/* Thoughtful perspectives on memorable meals around the world. */}
          </p>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <Link
            href="/"
            className="hover:text-gray-900 transition-colors"
          >
            Reviews
          </Link>
          <Link
            href="/about"
            className="hover:text-gray-900 transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="hover:text-gray-900 transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
