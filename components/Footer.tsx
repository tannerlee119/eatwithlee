import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center space-y-6">
          {/* Logo */}
          <div>
            <Link href="/" className="inline-block">
              <h2 className="text-3xl font-display font-bold text-white hover:text-primary transition-colors">
                EAT WITH LEE
              </h2>
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              Exploring the finest culinary experiences, one dish at a time
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex justify-center items-center gap-6 text-sm">
            <Link href="/" className="hover:text-primary transition-colors">
              Reviews
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/about" className="hover:text-primary transition-colors">
              About
            </Link>
            <span className="text-gray-600">•</span>
            <Link href="/contact" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-6">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors flex items-center gap-2"
              aria-label="Instagram"
            >
              <Instagram size={20} />
              <span className="text-sm">Instagram</span>
            </a>
            <a
              href="https://beliapp.co/app/tannerlee119"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors text-sm font-semibold"
            >
              Beli
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-800">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} Eat with Lee. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
