import Link from 'next/link';
import { Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Logo */}
          <div className="space-y-2">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-display font-semibold text-gray-900 tracking-tight">
                Eat with Lee
              </h2>
            </Link>
            <p className="mt-2 text-sm text-gray-400">
              Exploring the finest culinary experiences, one dish at a time
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex justify-center items-center gap-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Reviews
            </Link>
            <Link href="/about" className="hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-gray-900 transition-colors">
              Contact
            </Link>
          </nav>

          {/* Social Links */}
          <div className="flex justify-center items-center gap-6">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors flex items-center gap-2 text-gray-500"
              aria-label="Instagram"
            >
              <Instagram size={20} />
              <span className="text-sm">Instagram</span>
            </a>
            <a
              href="https://beliapp.co/app/tannerlee119"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors text-sm font-medium text-gray-500"
            >
              Beli
            </a>
          </div>

          {/* Copyright */}
          <div className="md:border-l md:pl-8 border-gray-100">
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Eat with Lee. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
