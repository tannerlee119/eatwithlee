import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <Link href="/" className="inline-block">
          <h1 className="text-6xl md:text-7xl font-display font-bold text-gray-900 hover:text-primary transition-colors">
            EAT WITH LEE
          </h1>
        </Link>
        <p className="mt-3 text-lg text-gray-600">
          Exploring the finest culinary experiences, one dish at a time
        </p>
      </div>
    </header>
  );
}
