import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-display font-bold text-gray-900 hover:text-primary transition-colors">
            Eat with Lee
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-primary transition-colors">
              Reviews
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary transition-colors">
              About
            </Link>

            {/* Social Links */}
            <div className="flex items-center gap-4 ml-4 border-l border-gray-200 pl-4">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://beli.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-primary transition-colors font-semibold text-sm"
              >
                Beli
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
