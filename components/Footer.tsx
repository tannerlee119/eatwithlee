import Link from 'next/link';

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
              href="https://www.instagram.com/seafoodiereviews"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors text-sm font-medium text-gray-500"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="https://beliapp.co/app/tannerlee119"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors text-sm font-medium text-gray-500"
            >
              Beli
            </a>
            <a
              href="https://www.yelp.com/user_details?userid=PLSjHiJgk6VDYQO8RigTuw"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gray-900 transition-colors flex items-center gap-2 text-gray-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.16 12.594l-4.995 1.433c-.96.276-1.74-.8-1.176-1.63l2.905-4.308a1.072 1.072 0 0 1 1.596-.206 9.194 9.194 0 0 1 2.364 3.252 1.073 1.073 0 0 1-.686 1.459zm-5.025 3.152l4.942 1.606a1.072 1.072 0 0 1 .636 1.48 9.316 9.316 0 0 1-2.47 3.169 1.073 1.073 0 0 1-1.592-.26l-2.76-4.409c-.528-.847.288-1.894 1.236-1.584zm-4.796-4.368L5.454 2.916a1.072 1.072 0 0 1 .466-1.5A14.973 14.973 0 0 1 11.184.003a1.07 1.07 0 0 1 1.153 1.068v9.768c0 1.096-1.45 1.483-1.998.535zm-.857 4.17L4.44 16.806a1.073 1.073 0 0 1-1.324-.92 9.218 9.218 0 0 1 .43-3.997 1.07 1.07 0 0 1 1.485-.62l4.668 2.279c.9.438.763 1.76-.207 2.000zm.886 1.477c.669-.744 1.901-.246 1.866.752l-.19 5.188a1.073 1.073 0 0 1-1.247 1.02 9.314 9.314 0 0 1-3.722-1.502 1.072 1.072 0 0 1-.187-1.6l3.477-3.864z" />
              </svg>
              <span className="text-sm font-medium">Yelp</span>
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
